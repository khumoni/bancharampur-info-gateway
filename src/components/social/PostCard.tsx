
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Post } from "@/lib/social/types";
import { PostHeader } from "./post/PostHeader";
import { PostContent } from "./post/PostContent";
import { PostActions } from "./post/PostActions";
import { CommentSection } from "./post/CommentSection";
import { RepostDialog } from "./RepostDialog";
import { useSocial } from "@/contexts/SocialContext";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface PostCardProps {
  post: Post;
  onReport: (postId: string, postAuthor: string) => void;
}

export const PostCard = ({ post, onReport }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const { likePost, addComment, addPost } = useSocial();
  const { toast } = useToast();
  const { language } = useApp();

  const handleLike = () => likePost(post.id);
  const toggleComments = () => setShowComments(prev => !prev);
  const handleRepost = () => setRepostDialogOpen(true);

  const handleRepostSubmit = async (originalPost: Post, comment: string) => {
    try {
      const repostContent = comment + (comment ? '\n\n' : '') + `রিপোস্ট: "${originalPost.content}" - @${originalPost.author}`;
      await addPost(repostContent);
      
      toast({
        title: language === 'bn' ? "রিপোস্ট সফল!" : "Repost successful!",
        description: language === 'bn' ? "পোস্টটি রিপোস্ট করা হয়েছে" : "Post has been reposted",
      });
    } catch (error) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "রিপোস্ট করতে ব্যর্থ" : "Failed to repost",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}?post=${post.id}`;
      const shareText = `"${post.content}" - ${post.author}\n\n${postUrl}`;
      
      await navigator.clipboard.writeText(shareText);
      setCopiedPostId(post.id);
      
      toast({
        title: language === 'bn' ? "কপি হয়েছে!" : "Copied!",
        description: language === 'bn' ? "পোস্টের লিংক কপি হয়েছে" : "Post link copied to clipboard",
      });

      setTimeout(() => setCopiedPostId(null), 2000);
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "লিংক কপি করতে ব্যর্থ" : "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const formatTime = (createdAt: string) => {
    if (!createdAt) return "কখনো";
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "এখনই";
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ঘন্টা আগে`;
    return `${Math.floor(diffInMinutes / 1440)} দিন আগে`;
  };

  return (
    <Card key={post.id} className="border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <PostHeader post={post} onReport={() => onReport(post.id, post.author)} formatTime={formatTime} />
        <PostContent post={post} />
        <PostActions 
          post={post}
          onLike={handleLike}
          onToggleComments={toggleComments}
          onShare={handleShare}
          onRepost={handleRepost}
          isCopied={copiedPostId === post.id}
        />
        {showComments && <CommentSection post={post} onCommentSubmit={addComment} />}
      </CardContent>
      
      <RepostDialog
        isOpen={repostDialogOpen}
        onOpenChange={setRepostDialogOpen}
        post={post}
        onRepost={handleRepostSubmit}
      />
    </Card>
  );
};
