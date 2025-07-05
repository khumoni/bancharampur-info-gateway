
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/lib/social/types";
import { Heart, MessageSquare, Share, Check, Repeat } from "lucide-react";

interface PostActionsProps {
  post: Post;
  onLike: () => void;
  onToggleComments: () => void;
  onShare: () => void;
  onRepost: () => void;
  isCopied: boolean;
}

export const PostActions = ({ post, onLike, onToggleComments, onShare, onRepost, isCopied }: PostActionsProps) => {
  const { user } = useAuth();
  
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onLike}
        className={`text-gray-600 ${
          user && post.likedBy.includes(user.id) 
            ? 'text-red-500 hover:text-red-600' 
            : 'hover:text-red-500'
        }`}
      >
        <Heart className={`mr-2 h-4 w-4 ${
          user && post.likedBy.includes(user.id) ? 'fill-current' : ''
        }`} />
        {post.likes}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600 hover:text-blue-500"
        onClick={onToggleComments}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        {post.comments.length}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600 hover:text-blue-500"
        onClick={onRepost}
      >
        <Repeat className="mr-2 h-4 w-4" />
        রিপোস্ট
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600 hover:text-green-500"
        onClick={onShare}
      >
        {isCopied ? (
          <Check className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <Share className="mr-2 h-4 w-4" />
        )}
        {isCopied ? 'কপি হয়েছে' : 'শেয়ার'}
      </Button>
    </div>
  );
};
