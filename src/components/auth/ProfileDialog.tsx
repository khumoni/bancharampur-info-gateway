import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Edit3, 
  Settings, 
  LogOut, 
  Shield, 
  Calendar,
  Flag,
  Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { ProfileStatsCard } from "./ProfileStatsCard";
import { UserContentTabs } from "./UserContentTabs";
import { ReportDialog } from "./ReportDialog";
import { EditProfileDialog } from "./EditProfileDialog";
import { ProfilePicturesDialog } from "./ProfilePicturesDialog";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export const ProfileDialog = ({ isOpen, onOpenChange, userId }: ProfileDialogProps) => {
  const { user, logout } = useAuth();
  const { language } = useApp();
  const [reportDialog, setReportDialog] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [picturesOpen, setPicturesOpen] = useState(false);

  // If userId is provided, we're viewing another user's profile
  const isOwnProfile = !userId || userId === user?.id;
  const targetUser = user; // In a real app, you'd fetch the target user data

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) {
      return language === 'bn' ? 'অজানা' : 'Unknown';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return language === 'bn' ? 'অবৈধ তারিখ' : 'Invalid Date';
    }
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!targetUser) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <DialogTitle className="sr-only">
              {isOwnProfile ? 'আপনার প্রোফাইল' : `${targetUser.name} এর প্রোফাইল`}
            </DialogTitle>
            
            {/* User Info Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-700 shadow-lg">
                  <AvatarImage src={targetUser.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-2xl font-bold">
                    {targetUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <button 
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setPicturesOpen(true)}
                    aria-label="Change profile picture"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{targetUser.name}</h2>
                  {targetUser.isVerified && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      <Shield className="h-3 w-3 mr-1" />
                      {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-2">
                  {targetUser.phone || '@' + targetUser.name.toLowerCase().replace(/\s+/g, '')}
                </p>
                
                <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {language === 'bn' ? 'যোগদান ' : 'Joined '} 
                    {formatJoinDate(targetUser.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Statistics */}
            <ProfileStatsCard userId={userId} />

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {isOwnProfile ? (
                <>
                  <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setEditProfileOpen(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'সেটিংস' : 'Settings'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'লগআউট' : 'Logout'}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setReportDialog(true)}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'রিপোর্ট করুন' : 'Report User'}
                </Button>
              )}
            </div>

            <Separator />

            {/* User Content Tabs */}
            <UserContentTabs userId={userId} />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialogs for profile actions */}
      {isOwnProfile && (
        <>
          <EditProfileDialog isOpen={editProfileOpen} onOpenChange={setEditProfileOpen} />
          <ProfilePicturesDialog isOpen={picturesOpen} onOpenChange={setPicturesOpen} />
        </>
      )}

      {/* Report Dialog for other users */}
      {!isOwnProfile && (
        <ReportDialog
          isOpen={reportDialog}
          onOpenChange={setReportDialog}
          reportType="user"
          targetId={userId || ''}
          targetName={targetUser.name}
        />
      )}
    </>
  );
};
