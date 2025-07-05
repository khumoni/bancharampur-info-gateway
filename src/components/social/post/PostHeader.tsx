
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileDialog } from "@/components/profile/UserProfileDialog";
import { Post } from "@/lib/social/types";
import { Clock, EyeOff, Flag } from "lucide-react";

interface PostHeaderProps {
  post: Post;
  onReport: () => void;
  formatTime: (createdAt: string) => string;
}

export const PostHeader = ({ post, onReport, formatTime }: PostHeaderProps) => {
  const { user } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center space-x-3 mb-4">
        <Avatar 
          className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          onClick={() => setProfileDialogOpen(true)}
        >
          <AvatarImage src={post.profilePicture} />
          <AvatarFallback className="bg-green-600 text-white">
            {post.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 
            className="font-medium text-gray-800 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setProfileDialogOpen(true)}
          >
            {post.author}
          </h4>
          <p className="text-sm text-gray-500 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {formatTime(post.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {post.status === 'hidden' && post.authorId === user?.id && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              <EyeOff className="h-3 w-3 mr-1" />
              লুকানো
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onReport}
            className="text-gray-500 hover:text-red-500"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <UserProfileDialog
        isOpen={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userId={post.authorId}
        userName={post.author}
        userAvatar={post.profilePicture}
        isVerified={true}
        joinDate="2024-01-15"
      />
    </>
  );
};
