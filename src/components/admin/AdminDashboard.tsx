
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AdminDashboardProps {
  totalUsers: number;
  todaysPosts: number;
  emergencyNotices: number;
  pendingPosts: number;
  onLocalInfoClick?: () => void;
}

export const AdminDashboard = ({
  totalUsers,
  todaysPosts,
  emergencyNotices,
  pendingPosts,
  onLocalInfoClick,
}: AdminDashboardProps) => {
  const isMobile = useIsMobile();

  // Responsive grid for dashboard cards
  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        ড্যাশবোর্ড
      </h1>
      <div
        className="
          grid gap-4
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-5
          w-full
        "
      >
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="flex flex-col items-center py-6 px-2 text-center">
            <span className="text-2xl md:text-3xl font-bold text-blue-700">{totalUsers}</span>
            <span className="text-gray-500 text-xs sm:text-sm">মোট ব্যবহারকারী</span>
          </CardContent>
        </Card>
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="flex flex-col items-center py-6 px-2 text-center">
            <span className="text-2xl md:text-3xl font-bold text-green-700">{todaysPosts}</span>
            <span className="text-gray-500 text-xs sm:text-sm">আজকের পোস্ট</span>
          </CardContent>
        </Card>
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="flex flex-col items-center py-6 px-2 text-center">
            <span className="text-2xl md:text-3xl font-bold text-red-700">{emergencyNotices}</span>
            <span className="text-gray-500 text-xs sm:text-sm">জরুরি বিজ্ঞপ্তি</span>
          </CardContent>
        </Card>
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="flex flex-col items-center py-6 px-2 text-center">
            <span className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingPosts}</span>
            <span className="text-gray-500 text-xs sm:text-sm">অপেক্ষমাণ পোস্ট</span>
          </CardContent>
        </Card>
        {/* Local Info Update Button */}
        <Card className="hover-lift transition-all duration-200 border-green-600">
          <CardContent className="flex flex-col items-center py-6 px-2 text-center">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded transition flex items-center"
              onClick={onLocalInfoClick}
              style={{ minWidth: 0 }}
              title="স্থানীয় তথ্য আপডেট"
              tabIndex={0}
              type="button"
            >
              <Sparkles className="w-5 h-5 mr-1" />
              <span className="text-xs md:text-sm">স্থানীয় তথ্য আপডেট</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

