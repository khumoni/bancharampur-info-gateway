
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Camera, Loader2, Settings, Flag, LogOut, Shield, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfileStatsCard } from "./ProfileStatsCard";
import { UserContentTabs } from "./UserContentTabs";
import { ReportDialog } from "./ReportDialog";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string; // For viewing other users' profiles
}

export const ProfileDialog = ({ isOpen, onOpenChange, userId }: ProfileDialogProps) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const { user, updateProfile, uploadProfilePicture, logout } = useAuth();
  const { language } = useApp();
  const { toast } = useToast();

  const isOwnProfile = !userId || userId === user?.id;
  const profileUser = user; // In a real app, you'd fetch the user data by userId

  const formatJoinDate = (date: string) => {
    const joinDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    return joinDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', options);
  };

  const handleOpen = () => {
    if (profileUser && isOwnProfile) {
      setName(profileUser.name);
      setUsername(profileUser.username);
      setPhone(profileUser.phone || "");
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
        setIsEditing(false);
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
      e.target.value = '';
    }
  };

  if (!profileUser) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { 
        if (open) handleOpen();
        onOpenChange(open);
        if (!open) setIsEditing(false);
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isOwnProfile 
                ? (language === 'bn' ? "আমার প্রোফাইল" : "My Profile")
                : `${profileUser.name}'s Profile`
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Info Header Section */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profileUser.profilePicture} />
                  <AvatarFallback className="text-2xl bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isOwnProfile && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                      id="profile-picture-upload"
                    />
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full bg-white border-2" disabled={uploading} asChild>
                      <label htmlFor="profile-picture-upload" className="cursor-pointer flex items-center justify-center">
                        {uploading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Camera className="h-3 w-3" />
                        )}
                      </label>
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-xl font-bold text-foreground">{profileUser.name}</h2>
                  {profileUser.emailVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                    </Badge>
                  )}
                  {profileUser.role === 'admin' && (
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">@{profileUser.username}</p>
                {profileUser.phone && (
                  <p className="text-sm text-muted-foreground">{profileUser.phone}</p>
                )}
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {language === 'bn' ? 'যোগদান' : 'Joined'} {formatJoinDate('2024-01-01')}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <ProfileStatsCard userId={userId} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {isOwnProfile ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>{isEditing ? (language === 'bn' ? 'বাতিল' : 'Cancel') : t("editProfile", language)}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("logout", language)}</span>
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsReportDialogOpen(true)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Flag className="h-4 w-4" />
                  <span>{language === 'bn' ? 'রিপোর্ট' : 'Report'}</span>
                </Button>
              )}
            </div>

            {/* Edit Profile Form */}
            {isOwnProfile && isEditing && (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-green-200 dark:border-green-700 rounded-lg">
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
            )}

            {/* User Content Tabs */}
            <UserContentTabs userId={userId} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        reportType="user"
        targetId={userId || profileUser.id}
        targetName={profileUser.name}
      />
    </>
  );
};
