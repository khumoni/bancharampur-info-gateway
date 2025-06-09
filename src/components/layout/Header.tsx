
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Menu, X, Settings, Globe, Moon, Shield, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/lib/translations";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ProfileDialog } from "@/components/auth/ProfileDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const { language, toggleLanguage, isDarkMode, toggleDarkMode } = useApp();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: t("home", language), href: "/" },
    { label: t("notices", language), href: "/notices" },
    { label: t("social", language), href: "/social" },
    { label: t("qa", language), href: "/qa" },
    { label: t("jobs", language), href: "/jobs" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Profile (when logged in) */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <div 
                  className="cursor-pointer"
                  onClick={() => setIsProfileDialogOpen(true)}
                >
                  <Avatar className="w-8 h-8 hover:ring-2 hover:ring-green-500 transition-all">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium">{user.username}</span>
                  {!user.emailVerified && (
                    <div className="text-xs text-orange-600">
                      {language === 'bn' ? "ইমেইল যাচাই করুন" : "Verify email"}
                    </div>
                  )}
                </div>
                <ProfileDialog 
                  isOpen={isProfileDialogOpen} 
                  onOpenChange={setIsProfileDialogOpen}
                />
              </div>
            ) : (
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">বি</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold text-green-800 dark:text-green-400">
                    {t("siteName", language)}
                  </h1>
                </div>
              </Link>
            )}
          </div>

          {/* Center - Logo (when user is logged in) or Navigation */}
          {user && (
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">বি</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-green-800 dark:text-green-400">
                  {t("siteName", language)}
                </h1>
              </div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Settings Dropdown (3 dots menu) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("settings", language)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
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
                <DropdownMenuItem className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    {t("darkMode", language)}
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      {t("admin", language)}
                    </Link>
                  </DropdownMenuItem>
                )}
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("logout", language)}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons (only when not logged in) */}
            {!user && (
              <div className="hidden md:flex items-center space-x-2">
                <LoginDialog />
                <RegisterDialog />
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-green-100 dark:border-green-800 py-4">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-foreground hover:text-green-600 dark:hover:text-green-400 font-medium py-2 px-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <LoginDialog />
                  <RegisterDialog />
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
