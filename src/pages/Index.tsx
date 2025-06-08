
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Users, MessageSquare } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmergencyNotices } from "@/components/home/EmergencyNotices";
import { PostFeed } from "@/components/social/PostFeed";
import { QuickAccess } from "@/components/home/QuickAccess";
import { LocalInfo } from "@/components/home/LocalInfo";
import { MarketRates } from "@/components/home/MarketRates";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

const Index = () => {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 dark:text-green-400 mb-4">
            {t("siteName", language)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t("tagline", language)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Users className="mr-2 h-5 w-5" />
              {t("joinUs", language)}
            </Button>
            <Button size="lg" variant="outline">
              <MapPin className="mr-2 h-5 w-5" />
              {t("viewMap", language)}
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Notices */}
      <section className="py-8 px-4 bg-red-50 dark:bg-red-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-400">
              {t("emergencyNotices", language)}
            </h2>
          </div>
          <EmergencyNotices />
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <QuickAccess />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Left Column - Local Info & Market Rates */}
          <div className="lg:col-span-1 space-y-6">
            <LocalInfo />
            <MarketRates />
          </div>

          {/* Right Column - Social Feed */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t("communityFeed", language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
