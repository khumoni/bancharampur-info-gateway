
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useSocial } from "@/contexts/SocialContext";
import { useApp } from "@/contexts/AppContext";
import { Image, Loader2, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostDialog = ({ isOpen, onOpenChange }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { addPost } = useSocial();
  const { language } = useApp();
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "শুধুমাত্র ছবি ফাইল আপলোড করুন" : "Please upload image files only",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "ছবির সাইজ ৫ এমবি এর বেশি হতে পারবে না" : "Image size must be less than 5MB",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles].slice(0, 4)); // Max 4 images
    e.target.value = ''; // Reset input
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "পোস্টের বিষয়বস্তু লিখুন" : "Please write your post content",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      await addPost(content);
      
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "পোস্ট প্রকাশ হয়েছে" : "Post published successfully",
      });
      
      // Reset form
      setContent("");
      setSelectedImages([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Post creation error:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "পোস্ট প্রকাশ ব্যর্থ" : "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'bn' ? 'নতুন পোস্ট লিখুন' : 'Create New Post'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={language === 'bn' ? "আপনার মন্তব্য লিখুন..." : "What's on your mind?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={uploading}
          />

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="post-images"
                disabled={uploading || selectedImages.length >= 4}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading || selectedImages.length >= 4}
                asChild
              >
                <label htmlFor="post-images" className="cursor-pointer">
                  <Image className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ছবি যোগ করুন' : 'Add Images'}
                  {selectedImages.length > 0 && ` (${selectedImages.length}/4)`}
                </label>
              </Button>
            </div>

            <Button type="submit" disabled={uploading || !content.trim()}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'bn' ? "প্রকাশ হচ্ছে..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {language === 'bn' ? "পোস্ট করুন" : "Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
