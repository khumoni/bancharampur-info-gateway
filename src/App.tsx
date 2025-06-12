
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
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Marketplace from "./pages/Marketplace";
import LocalInfo from "./pages/LocalInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="lovable-ui-theme">
      <AppProvider>
        <AuthProvider>
          <DataProvider>
            <SocialProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/local-info" element={<LocalInfo />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </SocialProvider>
          </DataProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
