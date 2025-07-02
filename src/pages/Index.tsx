import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostFeed } from "@/components/social/PostFeed";
import { EmergencyNotices } from "@/components/home/EmergencyNotices";
import { QuickAccess } from "@/components/home/QuickAccess";
import { useApp } from "@/contexts/AppContext";
import { useData } from "@/contexts/DataContext";
import { t } from "@/lib/translations";
import React, { useState, useEffect } from "react";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { HeaderBannerAd, SidebarAd, InFeedAd, FooterAd } from "@/components/ads/AdSenseComponent";
import { trackPageView } from "@/services/analytics";

const Index = () => {
  const { language } = useApp();
  const { notices } = useData();

  const [showAI, setShowAI] = useState(false);

  const activeNotices = notices.filter(notice => notice.isActive);

  useEffect(() => {
    trackPageView('home');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Header />
      
      {/* Header Banner Ad */}
      <HeaderBannerAd />
      
      <main className="relative">
        {/* Sidebar Ad for Desktop */}
        <div className="hidden lg:block fixed right-4 top-32 z-30">
          <SidebarAd />
        </div>
        {/* AI Assistant Floating Button */}
        <button
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-br from-emerald-400 to-blue-400 shadow-xl text-white rounded-full p-4 hover:scale-105 transition"
          onClick={() => setShowAI(true)}
          aria-label={language === "bn" ? "AI সহায়ক" : "AI Assistant"}
        >
          <span role="img" aria-label="Robot">🤖</span>
        </button>
        {showAI && (
          <ChatInterface language={language as "bn" | "en"} onClose={() => setShowAI(false)} />
        )}

        <section className="py-12 md:py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t("siteName", language)}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("tagline", language)}
            </p>
          </div>
        </section>

        {activeNotices.length > 0 && (
          <section className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <EmergencyNotices />
            </div>
          </section>
        )}

        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-4">
                {t("quickServices", language)}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
            <QuickAccess />
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  {t("communityFeed", language)}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
              </div>
            <PostFeed />
            
            {/* In-feed Ad after every 3rd post */}
            <InFeedAd index={3} />
          </div>
        </section>
      </main>

      {/* Footer Ad */}
      <FooterAd />
      
      <Footer />
    </div>
  );
};

export default Index;
