import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { SocialProvider } from "@/contexts/SocialContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminAI from "./pages/AdminAI";
import Marketplace from "./pages/Marketplace";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LocalInfo from "./pages/LocalInfo";
import Videos from "./pages/Videos";
import Messages from "./pages/Messages";
import Preferences from "./pages/Preferences";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useFCM } from "@/hooks/useFCM";
import { initializeRemoteConfig } from "@/lib/remoteConfig";

const queryClient = new QueryClient();

const App = () => {
  // FCM: Ask permission on load (one time)
  const { permission, fcmToken, requestPermission } = useFCM();

  useEffect(() => {
    // Initialize Firebase Remote Config safely
    initializeRemoteConfig().catch(error => {
      console.warn('Failed to initialize remote config:', error);
    });
    
    // Only ask if not granted/denied
    if (permission === "default") {
      // Ask user after a 1s delay to avoid spamming
      setTimeout(() => {
        if (window.confirm("আপনি কি browser notification চান?")) {
          requestPermission();
        }
      }, 1000);
    }
  }, [permission]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="lovable-ui-theme">
        <AppProvider>
          <AuthProvider>
            <LocationProvider>
              <PersonalizationProvider>
                <DataProvider>
                  <SocialProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-ai/*" element={<AdminAI />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/marketplace/:productId" element={<ProductDetailsPage />} />
                        <Route path="/local-info" element={<LocalInfo />} />
                        <Route path="/videos" element={<Videos />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/preferences" element={<Preferences />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                  </SocialProvider>
                </DataProvider>
              </PersonalizationProvider>
            </LocationProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
