import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDialog = ({ isOpen, onOpenChange }: ProfileDialogProps) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const handleOpen = () => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setPhone(user.phone || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const success = await updateProfile({ name, username, phone });
      
      if (success) {
        toast({
          title: language === 'bn' ? "সফল!" : "Success!",
          description: language === 'bn' ? "প্রোফাইল আপডেট হয়েছে" : "Profile updated successfully",
        });
        onOpenChange(false);
      } else {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "প্রোফাইল আপডেট ব্যর্থ" : "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "প্রোফাইল আপডেট ব্যর্থ" : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "শুধুমাত্র ছবি ফাইল আপলোড করুন" : "Please upload image files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "ছবির সাইজ ৫ এমবি এর বেশি হতে পারবে না" : "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      console.log('Uploading profile picture:', file.name, file.size);
      const success = await uploadProfilePicture(file);
      
      if (success) {
        toast({
          title: language === 'bn' ? "সফল!" : "Success!",
          description: language === 'bn' ? "ছবি আপলোড হয়েছে" : "Photo uploaded successfully",
        });
      } else {
        toast({
          title: language === 'bn' ? "ত্রুটি!" : "Error!",
          description: language === 'bn' ? "ছবি আপলোড ব্যর্থ" : "Failed to upload photo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: language === 'bn' ? "ছবি আপলোড ব্যর্থ" : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input value to allow re-uploading the same file
      e.target.value = '';
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { 
      if (open) handleOpen();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editProfile", language)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="text-lg">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
                id="profile-picture-upload"
              />
              <Button variant="outline" size="sm" disabled={uploading} asChild>
                <label htmlFor="profile-picture-upload" className="cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {uploading 
                    ? (language === 'bn' ? "আপলোড হচ্ছে..." : "Uploading...")
                    : t("uploadPhoto", language)
                  }
                </label>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                {language === 'bn' ? "নাম" : "Name"}
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">
                {t("username", language)}
              </Label>
              <Input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">
                {t("phone", language)}
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'bn' ? "আপডেট হচ্ছে..." : "Updating..."}
                </>
              ) : (
                language === 'bn' ? "আপডেট করুন" : "Update Profile"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
