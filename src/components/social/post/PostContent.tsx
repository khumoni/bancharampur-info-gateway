
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/social/types";
import { Hash } from "lucide-react";
import { SharedProductPreview } from "./SharedProductPreview";

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="mb-4">
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
      
      {post.postType === 'marketplace-share' && post.sharedProduct && (
        <SharedProductPreview product={post.sharedProduct} />
      )}

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.hashtags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              <Hash className="h-3 w-3 mr-1" />
              {tag.replace('#', '')}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
