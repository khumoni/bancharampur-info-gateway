import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/translations";
import { Post, Comment } from "@/lib/social/types";
import { Send } from "lucide-react";
import { useState } from "react";

interface CommentSectionProps {
  post: Post;
  onCommentSubmit: (postId: string, content: string) => Promise<void>;
}

export const CommentSection = ({ post, onCommentSubmit }: CommentSectionProps) => {
  const { user } = useAuth();
  const { language } = useApp();
  const [commentInput, setCommentInput] = useState("");

  const handleSubmit = async () => {
    if (commentInput.trim() && user) {
      await onCommentSubmit(post.id, commentInput);
      setCommentInput("");
    }
  };
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Existing Comments */}
      {post.comments.map((comment: Comment) => (
        <div key={comment.id} className="flex items-start space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.profilePicture} />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {comment.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="font-medium text-sm text-gray-800">{comment.author}</p>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{comment.time}</p>
          </div>
        </div>
      ))}

      {/* Comment Input */}
      {user && (
        <div className="flex items-start space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex space-x-2">
            <Textarea
              placeholder={t("comments", language)}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="min-h-[60px] resize-none"
            />
            <Button 
              size="sm"
              onClick={handleSubmit}
              disabled={!commentInput.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
