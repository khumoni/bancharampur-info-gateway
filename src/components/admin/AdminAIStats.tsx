import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, FileText, AlertTriangle } from "lucide-react";

interface Stats {
  totalUsers: number;
  pendingShops: number;
  totalPosts: number;
  unresolvedReports: number;
}

interface AdminAIStatsProps {
  stats: Stats;
}

export const AdminAIStats = ({ stats }: AdminAIStatsProps) => {
  const statCards = [
    {
      title: "মোট ব্যবহারকারী",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "অপেক্ষমাণ দোকান",
      value: stats.pendingShops,
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "মোট পোস্ট",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "অমীমাংসিত রিপোর্ট",
      value: stats.unresolvedReports,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <Card 
          key={card.title} 
          className="hover-lift animate-fade-in border-0 shadow-sm hover:shadow-md transition-all duration-300 glass-morphism"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};