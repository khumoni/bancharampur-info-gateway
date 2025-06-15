
import { Card, CardContent } from "@/components/ui/card";

interface AdminDashboardProps {
  totalUsers: number;
  todaysPosts: number;
  emergencyNotices: number;
  pendingPosts: number;
}

export const AdminDashboard = ({ totalUsers, todaysPosts, emergencyNotices, pendingPosts }: AdminDashboardProps) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
    <div className="flex flex-wrap gap-6">
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-700">{totalUsers}</span>
          <span className="text-gray-500 text-sm">মোট ব্যবহারকারী</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-700">{todaysPosts}</span>
          <span className="text-gray-500 text-sm">আজকের পোস্ট</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-red-700">{emergencyNotices}</span>
          <span className="text-gray-500 text-sm">জরুরি বিজ্ঞপ্তি</span>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-yellow-600">{pendingPosts}</span>
          <span className="text-gray-500 text-sm">অপেক্ষমাণ পোস্ট</span>
        </CardContent>
      </Card>
    </div>
  </div>
);
