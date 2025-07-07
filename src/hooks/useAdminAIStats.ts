import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stats } from "@/types/adminAI";

export const useAdminAIStats = (userId: string | undefined, userRole: string | undefined) => {
  const [stats, setStats] = useState<Stats>({ 
    totalUsers: 0, 
    pendingShops: 0, 
    totalPosts: 0, 
    unresolvedReports: 0 
  });

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

  useEffect(() => {
    if (!userId || !['admin', 'localAdmin'].includes(userRole || '')) {
      return;
    }
    
    fetchStats();
    const cleanup = setupRealtimeListeners();
    
    return cleanup;
  }, [userId, userRole]);

  return { stats, fetchStats };
};