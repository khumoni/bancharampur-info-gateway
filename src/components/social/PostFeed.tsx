import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, Flag, Clock, Image, Hash, Send, Loader2, Copy, Check, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useSocial } from "@/contexts/SocialContext";
import { ReportDialog } from "@/components/auth/ReportDialog";
import { t } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

export const PostFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [isPosting, setIsPosting] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [reportDialog, setReportDialog] = useState<{ isOpen: boolean; postId: string; postAuthor: string }>({
    isOpen: false,
    postId: "",
    postAuthor: ""
  });
  const { user } = useAuth();
  const { language } = useApp();
  const { posts, addPost, addComment, likePost, loading } = useSocial();
  const { toast } = useToast();

  // Show posts that are 'active', or 'hidden' if the current user is the author.
  const postsToDisplay = posts.filter(post => 
    post.status === 'active' || 
    (post.status === 'hidden' && post.authorId === user?.id)
  );

  const handlePostSubmit = async () => {
    if (newPost.trim() && user) {
      setIsPosting(true);
      try {
        await addPost(newPost);
        setNewPost("");
        toast({
          title: language === 'bn' ? "সফল!" : "Success!",
          description: language === 'bn' ? "পোস্ট প্রকাশিত হয়েছে" : "Post published successfully",
        });
      } catch (error) {
        console.error('Error posting:', error);
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "পোস্ট প্রকাশে ব্যর্থ" : "Failed to publish post",
          variant: "destructive",
        });
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInputs[postId];
    if (commentText?.trim() && user) {
      try {
        await addComment(postId, commentText);
        setCommentInputs({ ...commentInputs, [postId]: "" });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const handleShare = async (postId: string, content: string, author: string) => {
    try {
      const postUrl = `${window.location.origin}?post=${postId}`;
      const shareText = `"${content}" - ${author}\n\n${postUrl}`;
      
      await navigator.clipboard.writeText(shareText);
      setCopiedPostId(postId);
      
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

  const handleReport = (postId: string, postAuthor: string) => {
    setReportDialog({
      isOpen: true,
      postId,
      postAuthor
    });
  };

  const formatTime = (createdAt: string) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "এখনই";
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ঘন্টা আগে`;
    return `${Math.floor(diffInMinutes / 1440)} দিন আগে`;
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
      {/* Post Creation */}
      {user && (
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="আপনার মতামত শেয়ার করুন... #বাঞ্ছারামপুর ট্যাগ ব্যবহার করুন"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Image className="h-4 w-4" />
                  <span>ছবি যোগ করুন (সর্বোচ্চ ৩টি)</span>
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || isPosting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      পোস্ট করা হচ্ছে...
                    </>
                  ) : (
                    "পোস্ট করুন"
                  )}
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                দৈনিক সর্বোচ্চ ৫টি পোস্ট করতে পারবেন
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts - Only showing other users' posts */}
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
            <Card key={post.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.profilePicture} />
                    <AvatarFallback className="bg-green-600 text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{post.author}</h4>
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
                      onClick={() => handleReport(post.id, post.author)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  {post.hashtags.length > 0 && (
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

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleLike(post.id)}
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
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {post.comments.length}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-green-500"
                    onClick={() => handleShare(post.id, post.content, post.author)}
                  >
                    {copiedPostId === post.id ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Share className="mr-2 h-4 w-4" />
                    )}
                    {copiedPostId === post.id ? 'কপি হয়েছে' : 'শেয়ার'}
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {/* Existing Comments */}
                    {post.comments.map((comment) => (
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
                            value={commentInputs[post.id] || ""}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            className="min-h-[60px] resize-none"
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleCommentSubmit(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="self-end"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Dialog */}
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
