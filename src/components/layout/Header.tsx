
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Globe,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Shield
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ProfileDialog } from "@/components/auth/ProfileDialog";
import { t } from "@/lib/translations";

const MobileNav = () => {
  const { language } = useApp();
  const { logout } = useAuth();

  return (
    <div className="p-4 space-y-4">
      <Link to="/" className="block py-2 text-lg font-medium hover:text-foreground">
        {t("home", language)}
      </Link>
      <Link to="/local-info" className="block py-2 text-lg font-medium hover:text-foreground">
        {language === 'bn' ? 'স্থানীয় তথ্য' : 'Local Info'}
      </Link>
      <Link to="/marketplace" className="block py-2 text-lg font-medium hover:text-foreground">
        {language === 'bn' ? 'বাজার' : 'Marketplace'}
      </Link>
      <Button variant="outline" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        {t("logout", language)}
      </Button>
    </div>
  );
};

export const Header = () => {
  const { language, setLanguage } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">বা</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {t("siteName", language)}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          <Link 
            to="/" 
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            {t("home", language)}
          </Link>
          <Link 
            to="/local-info" 
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            {language === 'bn' ? 'স্থানীয় তথ্য' : 'Local Info'}
          </Link>
          <Link 
            to="/marketplace" 
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            {language === 'bn' ? 'বাজার' : 'Marketplace'}
          </Link>
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              className="text-foreground/60 hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Shield className="h-4 w-4" />
              <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'বাং' : 'EN'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('bn')}>
                বাংলা
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Actions */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                      {user.isAdmin && (
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">
                          {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile", language)}</span>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout", language)}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <LoginDialog />
              <RegisterDialog />
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog isOpen={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
};
