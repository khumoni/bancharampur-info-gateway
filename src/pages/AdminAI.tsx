import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Users, ShoppingBag, FileText, AlertTriangle, BarChart3, Settings, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminAIHeader } from "@/components/admin/AdminAIHeader";
import { AdminAIStats } from "@/components/admin/AdminAIStats";
import { AdminAISidebar } from "@/components/admin/AdminAISidebar";
import { AdminAIChatInterface } from "@/components/admin/AdminAIChatInterface";

interface Stats {
  totalUsers: number;
  pendingShops: number;
  totalPosts: number;
  unresolvedReports: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AdminAIDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, pendingShops: 0, totalPosts: 0, unresolvedReports: 0 });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sidebarItems = [
    { title: "ওভারভিউ", url: "/admin-ai", icon: BarChart3 },
    { title: "ব্যবহারকারী", url: "/admin-ai/users", icon: Users, badge: stats.totalUsers },
    { title: "পোস্ট", url: "/admin-ai/posts", icon: FileText, badge: stats.totalPosts },
    { title: "দোকান", url: "/admin-ai/shops", icon: ShoppingBag, badge: stats.pendingShops },
    { title: "রিপোর্ট", url: "/admin-ai/reports", icon: AlertTriangle, badge: stats.unresolvedReports },
    { title: "সেটিংস", url: "/admin-ai/settings", icon: Settings },
  ];

  useEffect(() => {
    if (!user || !['admin', 'localAdmin'].includes(user.role || '')) {
      return;
    }
    
    fetchStats();
    setupRealtimeListeners();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [usersRes, shopsRes, postsRes, reportsRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('shops').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('resolved', false)
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        pendingShops: shopsRes.count || 0,
        totalPosts: postsRes.count || 0,
        unresolvedReports: reportsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const setupRealtimeListeners = () => {
    const channels = [
      supabase.channel('users_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchStats),
      supabase.channel('shops_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, fetchStats),
      supabase.channel('posts_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchStats),
      supabase.channel('reports_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, fetchStats)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/supabase/functions/v1/admin-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || data.error || 'Error processing command',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      
      if (data.response && !data.error) {
        toast({
          title: "Command executed",
          description: data.response,
        });
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error: Could not process command. Make sure OpenAI API key is configured.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user || !['admin', 'localAdmin'].includes(user.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <Card className="w-full max-w-md shadow-xl border-0 glass-morphism animate-scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="p-3 bg-destructive/10 rounded-full">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <span className="text-destructive">অ্যাক্সেস অস্বীকৃত</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              এই ড্যাশবোর্ড অ্যাক্সেস করতে আপনার এডমিন অনুমতি প্রয়োজন।
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/5 to-background">
        <AdminAISidebar items={sidebarItems} />

        <main className="flex-1 flex flex-col">
          <AdminAIHeader userName={user?.name} />

          <div className="flex-1 p-6 space-y-6">
            <AdminAIStats stats={stats} />
            
            <AdminAIChatInterface
              chatMessages={chatMessages}
              inputMessage={inputMessage}
              isLoading={isLoading}
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onKeyPress={handleKeyPress}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminAIDashboard;