
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Camera, Loader2, Upload, Image, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePicturesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfilePicturesDialog = ({ isOpen, onOpenChange }: ProfilePicturesDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { user, uploadProfilePicture } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

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

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedImages(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'bn' ? 'প্রোফাইল ছবি' : 'Profile Pictures'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {language === 'bn' ? 'বর্তমান প্রোফাইল ছবি' : 'Current Profile Picture'}
              </h3>
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Upload New Picture */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">
              {language === 'bn' ? 'নতুন ছবি আপলোড করুন' : 'Upload New Picture'}
            </h3>
            
            <div className="flex justify-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                  id="profile-picture-upload"
                />
                <Button variant="outline" disabled={uploading} asChild>
                  <label htmlFor="profile-picture-upload" className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {uploading 
                      ? (language === 'bn' ? "আপলোড হচ্ছে..." : "Uploading...")
                      : (language === 'bn' ? "প্রোফাইল ছবি" : "Profile Picture")
                    }
                  </label>
                </Button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="gallery-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    <Image className="h-4 w-4 mr-2" />
                    {language === 'bn' ? "গ্যালারি ছবি" : "Gallery Images"}
                  </label>
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              {language === 'bn' 
                ? 'সর্বোচ্চ সাইজ: ৫ এমবি | সমর্থিত ফরম্যাট: JPG, PNG, GIF' 
                : 'Max size: 5MB | Supported formats: JPG, PNG, GIF'
              }
            </p>
          </div>

          {/* Gallery Preview */}
          {selectedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                {language === 'bn' ? 'নির্বাচিত ছবি' : 'Selected Images'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
