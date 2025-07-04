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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Globe,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  Shield,
  LogIn,
  Newspaper,
  ShoppingCart,
  MapPin,
  Bell,
  PlusCircle,
  Video,
  MessageCircle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ProfileDialog } from "@/components/auth/ProfileDialog";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { CreatePostDialog } from "@/components/social/CreatePostDialog";
import { t } from "@/lib/translations";
import { useLocation } from "@/contexts/LocationContext";
import { useLocation as useRouterLocation } from "react-router-dom";
import { LocationSelectorDialog } from "@/components/location/LocationSelectorDialog";

// MobileNav Component Props
interface MobileNavProps {
  setMobileMenuOpen: (open: boolean) => void;
  openProfileDialog: () => void;
  openCreatePostDialog: () => void;
}

// MobileNav Component (for Hamburger Menu Content)
const MobileNav = ({ 
  setMobileMenuOpen,
  openProfileDialog,
  openCreatePostDialog
} : MobileNavProps) => {
  const { language, setLanguage } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { location } = useLocation();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

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
        {user && (
          <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium" onClick={() => { openCreatePostDialog(); closeMenu(); }}>
            <PlusCircle className="mr-2 h-5 w-5" /> {language === 'bn' ? 'নতুন পোস্ট করুন' : 'Create Post'}
          </Button>
        )}
        {user?.isAdmin && (
          <Link to="/admin" onClick={closeMenu} className="flex items-center py-2 px-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">
            <Shield className="mr-2 h-5 w-5" />
            {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
          </Link>
        )}
      </nav>

      <DropdownMenuSeparator />

      <div className="space-y-3">
        {/* লোকেশন: সাইড মেনুতে view/change area button */}
        <button
          className="flex items-center gap-2 px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-500 via-emerald-500 to-green-400 text-white rounded-lg shadow hover:scale-105 transition"
          onClick={() => setLocationDialogOpen(true)}
        >
          <span className="truncate">
            <MapPin className="inline w-5 h-5 mr-1" />
            {location.district}, {location.upazila}
          </span>
        </button>
        {/* লোকেশন ডায়লগ মোবাইল/সাইডবার থেকে */}
        <LocationSelectorDialog isOpen={locationDialogOpen} onOpenChange={setLocationDialogOpen} />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase text-muted-foreground px-3 pt-2">{t("settings", language)}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start py-2 px-3 text-base font-medium">
              <Globe className="mr-2 h-5 w-5" /> {language === 'bn' ? 'ভাষা: বাংলা' : 'Language: English'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[calc(100%-2rem)] ml-4">
            <DropdownMenuItem onClick={() => { setLanguage('bn'); }}>বাংলা</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setLanguage('en'); }}>English</DropdownMenuItem>
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
  const { language, setLanguage: setAppLanguage } = useApp();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { location } = useLocation();
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const routerLocation = useRouterLocation();

  return (
    <TooltipProvider delayDuration={100}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:inline-block font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t("siteName", language)}
              </span>
            </Link>
          </div>

          {/* Icon Navigation - Visible on all screens */}
          <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-1">
            {/* Profile Icon - Below Logo */}
            <Tooltip>
              <TooltipTrigger asChild>
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/profile' ? 'bg-primary/10 text-primary' : ''}`}
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <LoginDialog 
                    triggerComponent={
                      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                        <User className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    }
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("profile", language)}</p>
              </TooltipContent>
            </Tooltip>

            {/* News Feed Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to="/">
                    <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'bn' ? "নিউজ ফিড" : "News Feed"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Video Icon - New */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/videos' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to="/videos">
                    <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'bn' ? "ভিডিও" : "Videos"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Messaging Icon - New */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/messages' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to="/messages">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'bn' ? "বার্তা" : "Messages"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Marketplace Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/marketplace' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to="/marketplace">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'bn' ? "বাজার" : "Marketplace"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Local Info Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/local-info' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <Link to="/local-info">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'bn' ? "স্থানীয় তথ্য" : "Local Info"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Create Post Icon - New (Desktop/Tablet) */}
            {user && ( // Only show if user is logged in
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:inline-flex h-9 w-9 sm:h-10 sm:w-10" onClick={() => setCreatePostOpen(true)}>
                    <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{language === 'bn' ? "নতুন পোস্ট" : "Create Post"}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Admin Icon (if user is admin) */}
            {user?.isAdmin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    asChild 
                    className={`h-9 w-9 sm:h-10 sm:w-10 ${routerLocation.pathname === '/admin' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <Link to="/admin">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center ml-auto">
            {/* ---- Remove the location button from header ---- */}
            {/* (location button code deleted) */}
            {/* ---- Keep language/theme buttons as before ---- */}
            <div className="hidden md:block mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4 mr-1" /> {/* Reduced margin */}
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
            <div className="hidden md:block mr-2">
              <Button
                variant="ghost"
                size="icon" // Made it icon only for consistency
                className="h-9 w-9" // Standardized size
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
             <div className="hidden md:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full"> {/* Standardized size */}
                      <Avatar className="h-9 w-9"> {/* Standardized size */}
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
                // Login/Register buttons for desktop are handled by Profile Icon which opens LoginDialog
                null 
              )}
            </div>

            <div className="md:hidden ml-2"> {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0 w-[300px] sm:w-[340px]">
                  <MobileNav 
                    setMobileMenuOpen={setMobileMenuOpen} 
                    openProfileDialog={() => setProfileOpen(true)}
                    openCreatePostDialog={() => { setCreatePostOpen(true);}}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <ProfileDialog isOpen={profileOpen} onOpenChange={setProfileOpen} />
      <ProfileSidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />
      <CreatePostDialog isOpen={createPostOpen} onOpenChange={setCreatePostOpen} />

      {/* FAB for Create Post - Mobile Only */}
      {user && (
          <div className="md:hidden fixed bottom-6 right-6 z-[100]"> {/* Ensure FAB is above other content */}
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button
                          size="lg"
                          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => setCreatePostOpen(true)}
                      >
                          <PlusCircle className="h-7 w-7" />
                          <span className="sr-only">{language === 'bn' ? "নতুন পোস্ট করুন" : "Create New Post"}</span>
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="mr-2 mb-1"> {/* Adjust position if needed */}
                      <p>{language === 'bn' ? "নতুন পোস্ট করুন" : "Create New Post"}</p>
                  </TooltipContent>
              </Tooltip>
          </div>
      )}

      {/* Location Selector Dialog */}
      <LocationSelectorDialog isOpen={locationDialogOpen} onOpenChange={setLocationDialogOpen} />
    </TooltipProvider>
  );
};
