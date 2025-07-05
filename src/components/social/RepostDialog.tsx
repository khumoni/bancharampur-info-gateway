import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Repeat, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/lib/social/types";

interface RepostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
  onRepost: (originalPost: Post, comment: string) => void;
}

export const RepostDialog = ({ isOpen, onOpenChange, post, onRepost }: RepostDialogProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useApp();
  const { user } = useAuth();

  const handleRepost = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await onRepost(post, comment);
      onOpenChange(false);
      setComment("");
    } catch (error) {
      console.error('Repost error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Repeat className="h-5 w-5 text-blue-600" />
            <span>{language === 'bn' ? 'রিপোস্ট করুন' : 'Repost'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User's comment area */}
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={language === 'bn' ? 'আপনার মতামত যোগ করুন...' : 'Add your comment...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Original post preview */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.profilePicture} />
                  <AvatarFallback>{post.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                </div>
              </div>
              <p className="text-sm">{post.content}</p>
              
              {/* Original post stats */}
              <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments.length}</span>
                <span>🔁 {post.shares}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button
              onClick={handleRepost}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'bn' ? 'পোস্ট করা হচ্ছে...' : 'Posting...'}
                </>
              ) : (
                <>
                  <Repeat className="mr-2 h-4 w-4" />
                  {language === 'bn' ? 'রিপোস্ট' : 'Repost'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};