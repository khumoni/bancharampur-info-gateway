
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminDashboardProps {
  totalUsers: number;
  todaysPosts: number;
  emergencyNotices: number;
  pendingPosts: number;
}

export const AdminDashboard = ({
  totalUsers,
  todaysPosts,
  emergencyNotices,
  pendingPosts,
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
          md:grid-cols-4
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
      </div>
    </div>
  );
};
