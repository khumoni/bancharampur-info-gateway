import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, Flag, Clock, Image, Hash, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  profilePicture?: string;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
  shares: number;
  hashtags: string[];
  profilePicture?: string;
}

export const PostFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const { user } = useAuth();
  const { language } = useApp();
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "মোহাম্মদ রহিম",
      avatar: "MR",
      time: "২ ঘন্টা আগে",
      content: "বাঁচারামপুর বাজারে আজ সবজির দাম কেমন? কেউ জানেন? #বাঁচারামপুর #বাজার",
      likes: 12,
      comments: [
        {
          id: 1,
          author: "সালমা বেগম",
          avatar: "সব",
          content: "আলু ৪০ টাকা কেজি, পেঁয়াজ ৫৫ টাকা",
          time: "১ ঘন্টা আগে"
        }
      ],
      shares: 2,
      hashtags: ["#বাঁচারামপুর", "#বাজার"]
    },
    {
      id: 2,
      author: "ফাতেমা খাতুন",
      avatar: "FK",
      time: "৪ ঘন্টা আগে",
      content: "কাল আমাদের এলাকায় বিদ্যুৎ থাকবে কি? রান্নার গ্যাসও নেই। #বাঁচারামপুর #বিদ্যুৎ",
      likes: 25,
      comments: [],
      shares: 4,
      hashtags: ["#বাঁচারামপুর", "#বিদ্যুৎ"]
    },
    {
      id: 3,
      author: "আব্দুল করিম",
      avatar: "AK",
      time: "৬ ঘন্টা আগে",
      content: "নতুন স্বাস্থ্য কমপ্লেক্সে সেবা নিলাম। খুবই ভালো ব্যবস্থা। ডাক্তারগণ খুব যত্ন নিয়ে দেখেছেন। #স্বাস্থ্যসেবা #বাঁচারামপুর",
      likes: 18,
      comments: [],
      shares: 6,
      hashtags: ["#স্বাস্থ্যসেবা", "#বাঁচারামপুর"]
    }
  ]);

  const handlePostSubmit = () => {
    if (newPost.trim() && user) {
      const hashtags = newPost.match(/#\w+/g) || [];
      const newPostObj: Post = {
        id: posts.length + 1,
        author: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        time: "এখনই",
        content: newPost,
        likes: 0,
        comments: [],
        shares: 0,
        hashtags,
        profilePicture: user.profilePicture
      };
      setPosts([newPostObj, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleCommentSubmit = (postId: number) => {
    const commentText = commentInputs[postId];
    if (commentText?.trim() && user) {
      const newComment: Comment = {
        id: Date.now(),
        author: user.name,
        avatar: user.name.charAt(0).toUpperCase(),
        content: commentText,
        time: "এখনই",
        profilePicture: user.profilePicture
      };
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
      
      setCommentInputs({ ...commentInputs, [postId]: "" });
    }
  };

  const toggleComments = (postId: number) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

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
                    placeholder="আপনার মতামত শেয়ার করুন... #বাঁচারামপুর ট্যাগ ব্যবহার করুন"
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
                  disabled={!newPost.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  পোস্ট করুন
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                দৈনিক সর্বোচ্চ ৫টি পোস্ট করতে পারবেন
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
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
                    {post.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
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
                  className="text-gray-600 hover:text-red-500"
                >
                  <Heart className="mr-2 h-4 w-4" />
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
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                  <Share className="mr-2 h-4 w-4" />
                  {post.shares}
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
        ))}
      </div>
    </div>
  );
};
