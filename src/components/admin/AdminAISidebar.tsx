import { NavLink, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface AdminAISidebarProps {
  items: SidebarItem[];
}

export const AdminAISidebar = ({ items }: AdminAISidebarProps) => {
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 shadow-sm bg-card/30 backdrop-blur-sm">
      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI Admin</h2>
              <p className="text-xs text-muted-foreground">স্মার্ট ম্যানেজমেন্ট</p>
            </div>
          </div>
        </div>
        
        <Separator className="mx-4" />
        
        <SidebarGroup className="px-4 py-2">
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-accent/80 text-sidebar-foreground hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        }`} />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && item.badge > 0 && (
                          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};