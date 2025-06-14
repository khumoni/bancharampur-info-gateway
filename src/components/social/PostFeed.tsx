
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useSocial } from "@/contexts/SocialContext";
import { ReportDialog } from "@/components/auth/ReportDialog";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";

export const PostFeed = () => {
  const [reportDialog, setReportDialog] = useState<{ isOpen: boolean; postId: string; postAuthor: string }>({
    isOpen: false,
    postId: "",
    postAuthor: ""
  });
  const { user } = useAuth();
  const { language } = useApp();
  const { posts, loading } = useSocial();

  const postsToDisplay = posts.filter(post => 
    post.status === 'active' || 
    (post.status === 'hidden' && post.authorId === user?.id)
  );

  const handleReport = (postId: string, postAuthor: string) => {
    setReportDialog({
      isOpen: true,
      postId,
      postAuthor
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user && <CreatePost />}

      <div className="space-y-4">
        {postsToDisplay.length === 0 && !loading ? (
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {language === 'bn' ? 'এখনো কোন পোস্ট নেই' : 'No posts yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          postsToDisplay.map((post) => (
            <PostCard key={post.id} post={post} onReport={handleReport} />
          ))
        )}
      </div>

      <ReportDialog
        isOpen={reportDialog.isOpen}
        onOpenChange={(open) => setReportDialog({ ...reportDialog, isOpen: open })}
        reportType="post"
        targetId={reportDialog.postId}
        targetName={reportDialog.postAuthor}
      />
    </div>
  );
};
