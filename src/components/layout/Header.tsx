import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/theme-provider";
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
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Globe,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Shield,
  LogIn,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ProfileDialog } from "@/components/auth/ProfileDialog";
import { t } from "@/lib/translations";

// MobileNav Component
const MobileNav = ({ 
  setMobileMenuOpen,
  openProfileDialog 
} : { 
  setMobileMenuOpen: (open: boolean) => void;
  openProfileDialog: () => void;
}) => {
  const { language, setLanguage } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="p-4 space-y-6 flex flex-col h-full">
      {user && (
        <div className="flex items-center space-x-3 p-2 border-b pb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex flex-col space-y-1">
        <Link to="/" onClick={closeMenu} className="block py-2 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">{t("home", language)}</Link>
        <Link to="/local-info" onClick={closeMenu} className="block py-2 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">{language === 'bn' ? 'স্থানীয় তথ্য' : 'Local Info'}</Link>
        <Link to="/marketplace" onClick={closeMenu} className="block py-2 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">{language === 'bn' ? 'বাজার' : 'Marketplace'}</Link>
        {user?.isAdmin && (
          <Link to="/admin" onClick={closeMenu} className="flex items-center py-2 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">
            <Shield className="mr-2 h-5 w-5" />
            {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
          </Link>
        )}
      </nav>

      <DropdownMenuSeparator />

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-muted-foreground px-3 pt-2">{t("settings", language)}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium">
              <Globe className="mr-2 h-5 w-5" /> {language === 'bn' ? 'ভাষা: বাংলা' : 'Language: English'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[calc(100%-2rem)] ml-4">
            <DropdownMenuItem onClick={() => { setLanguage('bn'); /* closeMenu(); // Optional */ }}>বাংলা</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setLanguage('en'); /* closeMenu(); // Optional */ }}>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
          <span>{theme === "light" ? (language === 'bn' ? "লাইট মোড" : "Light Mode") : (language === 'bn' ? "ডার্ক মোড" : "Dark Mode")}</span>
        </Button>
      </div>

      <div className="mt-auto space-y-2 pb-4"> {/* Pushes to bottom */}
        <DropdownMenuSeparator />
        <p className="text-xs font-semibold uppercase text-muted-foreground px-3 pt-2">
          {user ? t("profile", language) : (language === 'bn' ? "অ্যাকাউন্ট" : "Account")}
        </p>
        {user ? (
          <>
            <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium" onClick={() => { openProfileDialog(); /* Don't close main for dialog */ }}>
              <User className="mr-2 h-5 w-5" /> {t("profile", language)}
            </Button>
            <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium" onClick={() => { logout(); closeMenu(); }}>
              <LogOut className="mr-2 h-5 w-5" /> {t("logout", language)}
            </Button>
          </>
        ) : (
          <>
            <LoginDialog triggerComponent={
              <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium">
                <LogIn className="mr-2 h-5 w-5" /> {t("login", language)}
              </Button>
            }/>
            <div className="px-1"> {/* Wrapper for RegisterDialog for alignment if needed */}
              {/* RegisterDialog will use its default trigger button */}
              <RegisterDialog /> 
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Header = () => {
  const { language, setLanguage: setAppLanguage } = useApp(); // Renamed to avoid conflict with setTheme
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
        <div className="flex items-center ml-auto space-x-2 md:space-x-4"> {/* Adjusted spacing for responsiveness */}
          {/* Language Toggle - Visible on md and up */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'বাং' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setAppLanguage('bn')}>
                  বাংলা
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAppLanguage('en')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Theme Toggle - Visible on md and up */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* User Actions - Visible on md and up */}
          <div className="hidden md:flex items-center space-x-2">
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
              <>
                <LoginDialog />
                <RegisterDialog />
              </>
            )}
          </div>

          {/* Mobile menu button - Visible on screens smaller than md */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" /* Adjusted padding */
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 w-[300px] sm:w-[340px]"> {/* Adjusted width */}
                <MobileNav setMobileMenuOpen={setMobileMenuOpen} openProfileDialog={() => setProfileOpen(true)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Profile Dialog - managed at Header level */}
      <ProfileDialog isOpen={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
};
