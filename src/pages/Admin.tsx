import { useState } from "react";
import { PostManagementPanel } from "@/components/admin/PostManagementPanel";
import { MarketRatePanel } from "@/components/admin/MarketRatePanel";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { MarketplaceManager } from "@/components/admin/MarketplaceManager";

export default function AdminPage() {
  const [totalUsers, setTotalUsers] = useState(150);
  const [todaysPosts, setTodaysPosts] = useState(35);
  const [emergencyNotices, setEmergencyNotices] = useState(5);
  const [pendingPosts, setPendingPosts] = useState(10);

  return (
    <div className="space-y-8">
      <AdminDashboard
        totalUsers={totalUsers}
        todaysPosts={todaysPosts}
        emergencyNotices={emergencyNotices}
        pendingPosts={pendingPosts}
      />
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">মার্কেটপ্লেস ব্যবস্থাপনা</h2>
        <MarketplaceManager />
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">পোস্ট ও ইউজার ব্যবস্থাপনা</h2>
        <PostManagementPanel />
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">বাজারদর ব্যবস্থাপনা</h2>
        <MarketRatePanel />
      </section>
    </div>
  );
}
