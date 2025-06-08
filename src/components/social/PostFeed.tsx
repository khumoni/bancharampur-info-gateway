
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, Flag, Clock, Image, Hash } from "lucide-react";

export const PostFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "মোহাম্মদ রহিম",
      avatar: "MR",
      time: "২ ঘন্টা আগে",
      content: "বাঁচারামপুর বাজারে আজ সবজির দাম কেমন? কেউ জানেন? #বাঁচারামপুর #বাজার",
      likes: 12,
      comments: 5,
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
      comments: 8,
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
      comments: 3,
      shares: 6,
      hashtags: ["#স্বাস্থ্যসেবা", "#বাঁচারামপুর"]
    }
  ]);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const hashtags = newPost.match(/#\w+/g) || [];
      const newPostObj = {
        id: posts.length + 1,
        author: "আপনি",
        avatar: "আ",
        time: "এখনই",
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        hashtags
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

  return (
    <div className="space-y-6">
      {/* Post Creation */}
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <Textarea
              placeholder="আপনার মতামত শেয়ার করুন... #বাঁচারামপুর ট্যাগ ব্যবহার করুন"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[80px] resize-none"
            />
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

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full">
                  {post.avatar}
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
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                  <Share className="mr-2 h-4 w-4" />
                  {post.shares}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
