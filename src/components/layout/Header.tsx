import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Globe, Moon, Shield, LogOut, Home, ShoppingCart, User, Camera, Images, Bell, Edit3, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/translations";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ProfileDialog } from "@/components/auth/ProfileDialog";
import { ProfilePicturesDialog } from "@/components/auth/ProfilePicturesDialog";
import { CreatePostDialog } from "@/components/social/CreatePostDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPicturesDialogOpen, setIsPicturesDialogOpen] = useState(false);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const { language, toggleLanguage, isDarkMode, toggleDarkMode } = useApp();
  const { user, logout } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Profile, Home, Marketplace */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Avatar with Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <Avatar className="w-10 h-10 hover:ring-2 hover:ring-green-500 transition-all border-2 border-green-200 dark:border-green-700">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-background border-green-200 dark:border-green-700">
                    <DropdownMenuLabel className="text-foreground">{user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                    <DropdownMenuItem 
                      onClick={() => setIsProfileDialogOpen(true)}
                      className="flex items-center text-foreground hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsPicturesDialogOpen(true)}
                      className="flex items-center text-foreground hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer"
                    >
                      <Images className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'ছবি দেখুন' : 'View Pictures'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsCreatePostDialogOpen(true)}
                      className="flex items-center text-foreground hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'পোস্ট লিখুন' : 'Write Post'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Home Option */}
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span className="hidden md:block font-medium">{t("home", language)}</span>
                </Link>
                
                {/* Marketplace Option */}
                <Link 
                  to="/marketplace" 
                  className="flex items-center space-x-2 text-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden md:block font-medium">
                    {language === 'bn' ? 'বাজার' : 'Marketplace'}
                  </span>
                </Link>
                
                <ProfileDialog 
                  isOpen={isProfileDialogOpen} 
                  onOpenChange={setIsProfileDialogOpen}
                />
                <ProfilePicturesDialog 
                  isOpen={isPicturesDialogOpen} 
                  onOpenChange={setIsPicturesDialogOpen}
                />
                <CreatePostDialog 
                  isOpen={isCreatePostDialogOpen} 
                  onOpenChange={setIsCreatePostDialogOpen}
                />
              </>
            ) : (
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">বি</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-green-800 dark:text-green-400">
                    বাঞ্ছারামপুর ডিজিটাল ইনফোগাইট
                  </h1>
                </div>
              </Link>
            )}
          </div>

          {/* Center - Website Name (when user is logged in) */}
          {user && (
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">বি</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-green-800 dark:text-green-400">
                  বাঞ্ছারামপুর ডিজিটাল ইনফোগাইট
                </h1>
              </div>
            </Link>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications (only when logged in) */}
            {user && (
              <Button variant="ghost" size="sm" className="relative text-foreground hover:text-green-600 dark:hover:text-green-400">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                  3
                </Badge>
              </Button>
            )}

            {/* Auth Buttons (only when not logged in) */}
            {!user && (
              <div className="hidden md:flex items-center space-x-2">
                <LoginDialog />
                <RegisterDialog />
              </div>
            )}

            {/* Hamburger Menu (Settings) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:text-green-600 dark:hover:text-green-400">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-green-200 dark:border-green-700">
                <DropdownMenuLabel className="text-foreground">{t("settings", language)}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                
                {/* Quick Actions for logged in users */}
                {user && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => setIsCreatePostDialogOpen(true)}
                      className="flex items-center text-foreground hover:bg-green-50 dark:hover:bg-green-900 cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'পোস্ট লিখুন' : 'Write Post'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                  </>
                )}
                
                <DropdownMenuItem className="flex items-center justify-between text-foreground hover:bg-green-50 dark:hover:bg-green-900">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    {t("language", language)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="h-6 px-2 text-xs"
                  >
                    {language === 'bn' ? 'EN' : 'বাং'}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between text-foreground hover:bg-green-50 dark:hover:bg-green-900">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    {t("darkMode", language)}
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </DropdownMenuItem>
                
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center text-foreground hover:bg-green-50 dark:hover:bg-green-900">
                        <Shield className="h-4 w-4 mr-2" />
                        {t("admin", language)}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user && (
                  <>
                    <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                    <DropdownMenuItem onClick={logout} className="flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout", language)}
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* Auth options for mobile when not logged in */}
                {!user && (
                  <>
                    <DropdownMenuSeparator className="bg-green-200 dark:bg-green-700" />
                    <div className="md:hidden p-2 space-y-2">
                      <LoginDialog />
                      <RegisterDialog />
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
