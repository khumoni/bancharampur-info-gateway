import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostFeed } from "@/components/social/PostFeed";
import { QuickAccess } from "@/components/home/QuickAccess";
import { EmergencyNotices } from "@/components/home/EmergencyNotices";
import { useApp } from "@/contexts/AppContext";
import { useData } from "@/contexts/DataContext";
import { t } from "@/lib/translations";

const Index = () => {
  const { language } = useApp();
  const { notices } = useData();

  const activeNotices = notices.filter(notice => notice.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 via-sky-50/70 via-indigo-50/70 to-purple-50/70 dark:from-gray-900/90 dark:via-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 font-sans">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-blue-400/30 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '12s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-emerald-500 mr-3 animate-pulse" />
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
                {language === 'bn' ? 'স্বাগতম' : 'Welcome to'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              {t("siteName", language)}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              {t("tagline", language)}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Notices Section */}
      {activeNotices.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <EmergencyNotices />
          </div>
        </section>
      )}

      {/* Enhanced Quick Access section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              {t("quickServices", language)}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <QuickAccess />
        </div>
      </section>

      {/* Community Feed Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="shadow-2xl border-0 glass-morphism rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-700/20 dark:to-blue-700/20 border-b border-emerald-100/50 dark:border-emerald-800/50">
                <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-300 text-xl font-semibold">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mr-3 shadow-md">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  {t("communityFeed", language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PostFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
