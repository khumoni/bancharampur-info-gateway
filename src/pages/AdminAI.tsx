import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminAIHeader } from "@/components/admin/AdminAIHeader";
import { AdminAIStats } from "@/components/admin/AdminAIStats";
import { AdminAISidebar } from "@/components/admin/AdminAISidebar";
import { AdminAIChatInterface } from "@/components/admin/AdminAIChatInterface";
import { AdminAIAccessDenied } from "@/components/admin/AdminAIAccessDenied";
import { useAdminAIStats } from "@/hooks/useAdminAIStats";
import { useAdminAIChat } from "@/hooks/useAdminAIChat";
import { useAdminAISidebar } from "@/hooks/useAdminAISidebar";

const AdminAIDashboard = () => {
  const { user } = useAuth();
  const { stats } = useAdminAIStats(user?.id, user?.role);
  const {
    chatMessages,
    inputMessage,
    isLoading,
    setInputMessage,
    sendMessage,
    handleKeyPress
  } = useAdminAIChat();
  const sidebarItems = useAdminAISidebar(stats);

  if (!user || !['admin', 'localAdmin'].includes(user.role || '')) {
    return <AdminAIAccessDenied />;
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