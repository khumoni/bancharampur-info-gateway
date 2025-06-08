
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MapPin, Users, MessageSquare, Calendar, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmergencyNotices } from "@/components/home/EmergencyNotices";
import { PostFeed } from "@/components/social/PostFeed";
import { QuickAccess } from "@/components/home/QuickAccess";
import { LocalInfo } from "@/components/home/LocalInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">
            বাঁচারামপুর ডিজিটাল ইনফোগেট
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            আপনার প্রয়োজনীয় তথ্য এক জায়গায়
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Users className="mr-2 h-5 w-5" />
              যোগ দিন
            </Button>
            <Button size="lg" variant="outline">
              <MapPin className="mr-2 h-5 w-5" />
              মানচিত্র দেখুন
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Notices */}
      <section className="py-8 px-4 bg-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-red-800">জরুরি বিজ্ঞপ্তি</h2>
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Local Info */}
          <div className="lg:col-span-1">
            <LocalInfo />
          </div>

          {/* Right Column - Social Feed */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  কমিউনিটি ফিড
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
