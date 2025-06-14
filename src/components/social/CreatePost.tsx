
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial } from "@/contexts/SocialContext";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export const CreatePost = () => {
    const [newPost, setNewPost] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { user } = useAuth();
    const { addPost } = useSocial();
    const { toast } = useToast();
    const { language } = useApp();

    const handlePostSubmit = async () => {
        if (!user) {
            toast({
              title: language === 'bn' ? "প্রয়োজন!" : "Required!",
              description: language === 'bn' ? "পোস্ট করার জন্য আপনাকে লগইন করতে হবে।" : "You need to be logged in to post.",
              variant: "destructive",
            });
            return;
        }

        if (newPost.trim()) {
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
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                toast({
                  title: language === 'bn' ? "ত্রুটি!" : "Error!",
                  description: (language === 'bn' ? "পোস্ট প্রকাশে ব্যর্থ: " : "Failed to publish post: ") + errorMessage,
                  variant: "destructive",
                });
            } finally {
                setIsPosting(false);
            }
        }
    };
    
    if (!user) return null;

    return (
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
    );
};
