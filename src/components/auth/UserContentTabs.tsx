
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial } from "@/contexts/SocialContext";
import { useApp } from "@/contexts/AppContext";
import { FileText, Repeat, Bookmark, Edit3 } from "lucide-react";

interface UserContentTabsProps {
  userId?: string;
}

export const UserContentTabs = ({ userId }: UserContentTabsProps) => {
  const { user } = useAuth();
  const { posts } = useSocial();
  const { language } = useApp();

  const targetUserId = userId || user?.id;
  const userPosts = posts.filter(post => post.authorId === targetUserId);

  const PostCard = ({ post }: { post: any }) => (
    <Card className="mb-4 border-green-200 dark:border-green-700">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <span className="text-green-800 dark:text-green-200 font-semibold">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-foreground">{post.author}</h4>
              <span className="text-sm text-muted-foreground">{post.time}</span>
            </div>
            <p className="text-foreground">{post.content}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments.length}</span>
              <span>🔁 {post.shares}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-green-50 dark:bg-green-900">
        <TabsTrigger value="posts" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'পোস্ট' : 'Posts'}
          </span>
        </TabsTrigger>
        <TabsTrigger value="reposts" className="flex items-center space-x-2">
          <Repeat className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'রিপোস্ট' : 'Reposts'}
          </span>
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center space-x-2">
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'সেভ' : 'Saved'}
          </span>
        </TabsTrigger>
        <TabsTrigger value="drafts" className="flex items-center space-x-2">
          <Edit3 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'ড্রাফট' : 'Drafts'}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-4">
        <div className="max-h-80 overflow-y-auto">
          {userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <Card className="border-green-200 dark:border-green-700">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {language === 'bn' ? 'কোন পোস্ট নেই' : 'No posts yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reposts" className="mt-4">
        <Card className="border-green-200 dark:border-green-700">
          <CardContent className="p-8 text-center">
            <Repeat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'bn' ? 'কোন রিপোস্ট নেই' : 'No reposts yet'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved" className="mt-4">
        <Card className="border-green-200 dark:border-green-700">
          <CardContent className="p-8 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'bn' ? 'কোন সেভ পোস্ট নেই' : 'No saved posts yet'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="drafts" className="mt-4">
        <Card className="border-green-200 dark:border-green-700">
          <CardContent className="p-8 text-center">
            <Edit3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'bn' ? 'কোন ড্রাফট নেই' : 'No drafts yet'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
