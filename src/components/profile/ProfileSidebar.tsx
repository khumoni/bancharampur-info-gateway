import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Calendar,
  Edit3,
  Camera,
  Puzzle,
  Bot,
  MessageSquare,
  Bookmark,
  Heart,
  TrendingUp,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { EditProfileDialog } from "@/components/auth/EditProfileDialog";
import { ProfilePicturesDialog } from "@/components/auth/ProfilePicturesDialog";
import { ThirdPartyTools } from "./ThirdPartyTools";

interface ProfileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileSidebar = ({ isOpen, onOpenChange }: ProfileSidebarProps) => {
  const { user, logout } = useAuth();
  const { language } = useApp();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [picturesOpen, setPicturesOpen] = useState(false);
  const [showTools, setShowTools] = useState(false);

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

  if (!user) return null;

  const profileActions = [
    {
      icon: Edit3,
      label: language === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile',
      onClick: () => setEditProfileOpen(true)
    },
    {
      icon: Camera,
      label: language === 'bn' ? 'ছবি পরিবর্তন' : 'Change Picture',
      onClick: () => setPicturesOpen(true)
    },
    {
      icon: Settings,
      label: language === 'bn' ? 'সেটিংস' : 'Settings',
      onClick: () => console.log('Settings')
    },
    {
      icon: Bookmark,
      label: language === 'bn' ? 'সেভ করা পোস্ট' : 'Saved Posts',
      onClick: () => console.log('Saved posts')
    },
    {
      icon: Heart,
      label: language === 'bn' ? 'পছন্দের পোস্ট' : 'Liked Posts',
      onClick: () => console.log('Liked posts')
    },
    {
      icon: TrendingUp,
      label: language === 'bn' ? 'ট্রেন্ডিং' : 'Trending',
      onClick: () => console.log('Trending')
    },
    {
      icon: Puzzle,
      label: language === 'bn' ? 'তৃতীয় পক্ষের টুলস' : 'Third-party Tools',
      onClick: () => setShowTools(true)
    }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-80 p-0 bg-background border-r">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative group">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-lg font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                    {user.isVerified && (
                      <Badge variant="secondary" className="h-5">
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="text-xs">{language === 'bn' ? 'যাচাইকৃত' : 'Verified'}</span>
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {user.phone || '@' + user.name.toLowerCase().replace(/\s+/g, '')}
                  </p>
                  
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {language === 'bn' ? 'যোগদান ' : 'Joined '} 
                      {formatJoinDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-foreground">127</p>
                  <p className="text-xs text-muted-foreground">{language === 'bn' ? 'পোস্ট' : 'Posts'}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">1.2K</p>
                  <p className="text-xs text-muted-foreground">{language === 'bn' ? 'ফলোয়ার' : 'Followers'}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">89</p>
                  <p className="text-xs text-muted-foreground">{language === 'bn' ? 'ফলোয়িং' : 'Following'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 py-4">
                {profileActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-4 hover:bg-muted/50"
                    onClick={action.onClick}
                  >
                    <action.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <EditProfileDialog isOpen={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <ProfilePicturesDialog isOpen={picturesOpen} onOpenChange={setPicturesOpen} />
      <ThirdPartyTools isOpen={showTools} onOpenChange={setShowTools} />
    </>
  );
};