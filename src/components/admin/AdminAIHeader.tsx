import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bot, Sparkles } from "lucide-react";

interface AdminAIHeaderProps {
  userName?: string;
}

export const AdminAIHeader = ({ userName }: AdminAIHeaderProps) => {
  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6 animate-fade-in">
      <SidebarTrigger className="hover:bg-accent/80 transition-colors" />
      
      <div className="ml-6 flex items-center gap-3">
        <div className="relative">
          <Bot className="h-8 w-8 text-primary animate-float" />
          <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {userName ? `স্বাগতম, ${userName}` : 'AI দিয়ে আপনার প্ল্যাটফর্ম পরিচালনা করুন'}
          </p>
        </div>
      </div>
    </header>
  );
};