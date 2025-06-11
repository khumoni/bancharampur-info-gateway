
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostFeed } from "@/components/social/PostFeed";
import { QuickAccess } from "@/components/home/QuickAccess";
import { LocalInfo } from "@/components/home/LocalInfo";
import { MarketRates } from "@/components/home/MarketRates";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

const Index = () => {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-emerald-900/10 dark:via-blue-900/10 dark:to-purple-900/10">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-emerald-500 mr-3 animate-pulse" />
              <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">
                {language === 'bn' ? 'স্বাগতম' : 'Welcome to'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              {t("siteName", language)}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              {t("tagline", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700 hover:text-emerald-800 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg">
                {language === 'bn' ? 'আরো জানুন' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Access */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {t("quickServices", language)}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <QuickAccess />
        </div>
      </section>

      {/* Enhanced Main Content Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Left Column - Enhanced Local Info & Market Rates */}
          <div className="lg:col-span-1 space-y-8">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <LocalInfo />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <MarketRates />
            </div>
          </div>

          {/* Right Column - Enhanced Social Feed */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-emerald-100 dark:border-emerald-800/30">
                  <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-400 text-xl">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg mr-3">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
