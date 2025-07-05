import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Shield, 
  Calendar,
  Flag,
  Users,
  FileText,
  Heart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { ReportDialog } from "@/components/auth/ReportDialog";

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  isVerified?: boolean;
  joinDate?: string;
}

export const UserProfileDialog = ({ 
  isOpen, 
  onOpenChange, 
  userId, 
  userName, 
  userAvatar, 
  userEmail,
  isVerified = false,
  joinDate 
}: UserProfileDialogProps) => {
  const { user } = useAuth();
  const { language } = useApp();
  const [reportDialog, setReportDialog] = useState(false);

  const isOwnProfile = user?.id === userId;

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return language === 'bn' ? 'অজানা' : 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return language === 'bn' ? 'অবৈধ তারিখ' : 'Invalid Date';
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleSendMessage = () => {
    // Navigate to messages page with this user selected
    console.log('Send message to:', userId);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <DialogTitle className="sr-only">
              {userName} এর প্রোফাইল
            </DialogTitle>
            
            {/* User Header */}
            <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={userAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
                  {isVerified && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      <Shield className="h-3 w-3 mr-1" />
                      {language === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                    </Badge>
                  )}
                </div>
                
                {userEmail && (
                  <p className="text-muted-foreground mb-2">{userEmail}</p>
                )}
                
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {language === 'bn' ? 'যোগদান ' : 'Joined '} 
                    {formatJoinDate(joinDate)}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <FileText className="h-6 w-6 text-primary mb-2" />
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'পোস্ট' : 'Posts'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Users className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold">312</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'ফলোয়ার' : 'Followers'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Heart className="h-6 w-6 text-red-500 mb-2" />
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'লাইক' : 'Likes'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isOwnProfile && (
                <>
                  <Button onClick={handleSendMessage} className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setReportDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'রিপোর্ট' : 'Report'}
                  </Button>
                </>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === 'bn' ? 'সাম্প্রতিক কার্যকলাপ' : 'Recent Activity'}
              </h3>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'একটি নতুন পোস্ট শেয়ার করেছেন' : 'Shared a new post'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">২ ঘন্টা আগে</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'স্থানীয় তথ্য আপডেট করেছেন' : 'Updated local information'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">১ দিন আগে</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReportDialog
        isOpen={reportDialog}
        onOpenChange={setReportDialog}
        reportType="user"
        targetId={userId}
        targetName={userName}
      />
    </>
  );
};