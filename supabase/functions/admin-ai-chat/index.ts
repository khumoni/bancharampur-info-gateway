import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Command {
  action: string;
  target: string;
  id?: string;
  email?: string;
  location?: string;
  count?: number;
}

async function parseCommand(message: string): Promise<Command | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Parse admin commands and return JSON. Available actions:
          - delete: delete post/shop/user by ID
          - block/unblock: block/unblock user by email
          - approve/reject: approve/reject shop by ID
          - highlight: highlight top N shops in location
          - resolve: resolve report by ID
          
          Return JSON with: {"action": "delete|block|approve|highlight|resolve", "target": "post|shop|user|report", "id": "uuid", "email": "email", "location": "location", "count": number}
          
          Examples:
          "Delete post ID 123" -> {"action": "delete", "target": "post", "id": "123"}
          "Block user john@example.com" -> {"action": "block", "target": "user", "email": "john@example.com"}
          "Approve all pending shops" -> {"action": "approve", "target": "shop"}
          "Highlight top 3 shops in Brahmanbaria" -> {"action": "highlight", "target": "shop", "location": "Brahmanbaria", "count": 3}`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to parse command');
  }

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return null;
  }
}

async function executeCommand(command: Command, userId: string): Promise<string> {
  // Verify user is admin
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (!user || !['admin', 'localAdmin'].includes(user.role)) {
    return "Access denied. Admin privileges required.";
  }

  try {
    switch (`${command.action}_${command.target}`) {
      case 'delete_post':
        if (!command.id) return "Post ID required";
        await supabase.from('posts').delete().eq('id', command.id);
        return `Post ${command.id} deleted successfully`;

      case 'delete_shop':
        if (!command.id) return "Shop ID required";
        await supabase.from('shops').delete().eq('id', command.id);
        return `Shop ${command.id} deleted successfully`;

      case 'block_user':
        if (!command.email) return "User email required";
        await supabase.from('users').update({ status: 'blocked' }).eq('email', command.email);
        return `User ${command.email} blocked successfully`;

      case 'unblock_user':
        if (!command.email) return "User email required";
        await supabase.from('users').update({ status: 'active' }).eq('email', command.email);
        return `User ${command.email} unblocked successfully`;

      case 'approve_shop':
        if (command.id) {
          await supabase.from('shops').update({ status: 'approved' }).eq('id', command.id);
          return `Shop ${command.id} approved successfully`;
        } else {
          const { count } = await supabase.from('shops').update({ status: 'approved' }).eq('status', 'pending');
          return `${count} pending shops approved successfully`;
        }

      case 'reject_shop':
        if (!command.id) return "Shop ID required";
        await supabase.from('shops').update({ status: 'rejected' }).eq('id', command.id);
        return `Shop ${command.id} rejected successfully`;

      case 'highlight_shop':
        const location = command.location || '';
        const count = command.count || 3;
        
        // Reset all highlights first
        await supabase.from('shops').update({ highlighted: false }).eq('highlighted', true);
        
        // Get top shops by created_at (or you could add a rating system)
        const { data: shops } = await supabase
          .from('shops')
          .select('id')
          .eq('status', 'approved')
          .ilike('location', `%${location}%`)
          .order('created_at', { ascending: false })
          .limit(count);

        if (shops && shops.length > 0) {
          const shopIds = shops.map(s => s.id);
          await supabase.from('shops').update({ highlighted: true }).in('id', shopIds);
          return `Highlighted top ${shops.length} shops in ${location}`;
        }
        return `No shops found in ${location}`;

      case 'resolve_report':
        if (!command.id) return "Report ID required";
        await supabase.from('reports').update({ resolved: true }).eq('id', command.id);
        return `Report ${command.id} marked as resolved`;

      default:
        return "Command not recognized. Try: delete post/shop, block/unblock user, approve/reject shop, highlight shops, or resolve report.";
    }
  } catch (error) {
    console.error('Command execution error:', error);
    return `Error executing command: ${error.message}`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing authorization header');
    }

    // Get user ID from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Invalid user token');
    }

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        response: "OpenAI API key not configured. Please add OPENAI_API_KEY to edge function secrets." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const command = await parseCommand(message);
    
    if (!command) {
      return new Response(JSON.stringify({ 
        response: "I couldn't understand that command. Try something like 'delete post ID 123' or 'block user john@example.com'" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await executeCommand(command, user.id);

    return new Response(JSON.stringify({ response: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin AI Chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});