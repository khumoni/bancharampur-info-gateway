import { useMemo } from "react";
import { Users, ShoppingBag, FileText, AlertTriangle, BarChart3, Settings } from "lucide-react";
import { Stats, SidebarItem } from "@/types/adminAI";

export const useAdminAISidebar = (stats: Stats): SidebarItem[] => {
  return useMemo(() => [
    { title: "ওভারভিউ", url: "/admin-ai", icon: BarChart3 },
    { title: "ব্যবহারকারী", url: "/admin-ai/users", icon: Users, badge: stats.totalUsers },
    { title: "পোস্ট", url: "/admin-ai/posts", icon: FileText, badge: stats.totalPosts },
    { title: "দোকান", url: "/admin-ai/shops", icon: ShoppingBag, badge: stats.pendingShops },
    { title: "রিপোর্ট", url: "/admin-ai/reports", icon: AlertTriangle, badge: stats.unresolvedReports },
    { title: "সেটিংস", url: "/admin-ai/settings", icon: Settings },
  ], [stats]);
};