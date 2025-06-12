
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial } from "@/contexts/SocialContext";
import { useApp } from "@/contexts/AppContext";
import { FileText, Repeat, Heart, MessageCircle } from "lucide-react";

interface ProfileStatsCardProps {
  userId?: string;
}

export const ProfileStatsCard = ({ userId }: ProfileStatsCardProps) => {
  const { user } = useAuth();
  const { posts } = useSocial();
  const { language } = useApp();

  const targetUserId = userId || user?.id;
  
  // Calculate user statistics
  const userPosts = posts.filter(post => post.authorId === targetUserId);
  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalReposts = userPosts.reduce((sum, post) => sum + post.shares, 0);

  const stats = [
    {
      icon: FileText,
      label: language === 'bn' ? 'পোস্ট' : 'Posts',
      count: totalPosts,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Repeat,
      label: language === 'bn' ? 'রিপোস্ট' : 'Reposts',
      count: totalReposts,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Heart,
      label: language === 'bn' ? 'লাইক' : 'Likes',
      count: totalLikes,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: MessageCircle,
      label: language === 'bn' ? 'মন্তব্য' : 'Comments',
      count: totalComments,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <Card className="border-green-200 dark:border-green-700">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center space-y-2">
                <div className={`flex justify-center ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
