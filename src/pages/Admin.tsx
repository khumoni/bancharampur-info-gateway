import { useState } from "react";
import { PostManagementPanel } from "@/components/admin/PostManagementPanel";
import { MarketRatePanel } from "@/components/admin/MarketRatePanel";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { MarketplaceManager } from "@/components/admin/MarketplaceManager";
import { useApp } from "@/contexts/AppContext";
import { LocalInfoAdminPanel } from "@/components/admin/LocalInfoAdminPanel";
// Manager imports for each local info category:
import { EducationManager } from "@/components/admin/EducationManager";
import { HealthManager } from "@/components/admin/HealthManager";
import { TransportManager } from "@/components/admin/TransportManager";
import { AdministrativeInfoManager } from "@/components/admin/AdministrativeInfoManager";
import { UtilitiesManager } from "@/components/admin/UtilitiesManager";
import { WeatherManager } from "@/components/admin/WeatherManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { ScholarshipManager } from "@/components/admin/ScholarshipManager";
import { LegalAidManager } from "@/components/admin/LegalAidManager";
import { AgricultureManager } from "@/components/admin/AgricultureManager";
import { HousingManager } from "@/components/admin/HousingManager";
import { DigitalServiceManager } from "@/components/admin/DigitalServiceManager";
import { CultureInfoManager } from "@/components/admin/CultureInfoManager";
import { PrivateHealthManager } from "@/components/admin/PrivateHealthManager";
import { EmergencyNewsManager } from "@/components/admin/EmergencyNewsManager";
import { JobManager } from "@/components/admin/JobManager";
import { t } from "@/lib/translations";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const [totalUsers, setTotalUsers] = useState(150);
  const [todaysPosts, setTodaysPosts] = useState(35);
  const [emergencyNotices, setEmergencyNotices] = useState(5);
  const [pendingPosts, setPendingPosts] = useState(10);

  // Local Info Category tab state
  const [localInfoTab, setLocalInfoTab] = useState<string | null>(null);
  const { language } = useApp();

  // All local info categories with label and manager
  const localInfoCategories = [
    { id: "education", label: t("education", language), manager: EducationManager },
    { id: "health", label: t("health", language), manager: HealthManager },
    { id: "transport", label: t("transport", language), manager: TransportManager },
    { id: "admin", label: t("admin", language), manager: AdministrativeInfoManager },
    { id: "utilities", label: t("utilities", language), manager: UtilitiesManager },
    { id: "weather", label: t("weather", language), manager: WeatherManager },
    { id: "projects", label: t("projects", language), manager: ProjectsManager },
    { id: "announcements", label: t("announcements", language), manager: AnnouncementsManager },
    { id: "scholarship", label: t("scholarship", language), manager: ScholarshipManager },
    { id: "legal", label: t("legal", language), manager: LegalAidManager },
    { id: "agriculture", label: t("agriculture", language), manager: AgricultureManager },
    { id: "housing", label: t("housing", language), manager: HousingManager },
    { id: "digital_services", label: t("digitalServices", language), manager: DigitalServiceManager },
    { id: "culture", label: t("culture", language), manager: CultureInfoManager },
    { id: "private_health", label: t("privateHealth", language), manager: PrivateHealthManager },
    { id: "emergency_news", label: t("emergencyNews", language), manager: EmergencyNewsManager },
    { id: "jobs", label: t("jobs", language), manager: JobManager },
  ];

  const { user, loading } = useAuth();

  return (
    <div className="space-y-10 px-2 md:px-4 py-8 max-w-6xl mx-auto">
      {/* DEBUG: Auth Session Diagnostics - Only visible to admin */}
      <div className="mb-8">
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-3 text-sm text-yellow-900" style={{ display: user?.isAdmin ? "block" : "none" }}>
          <strong>Session Debug Panel</strong>
          <div>User: <span className="font-mono">{user ? user.email : "No user"}</span></div>
          <div>User ID: <span className="font-mono">{user ? user.id : "—"}</span></div>
          <div>Verified: <span className="font-mono">{user ? String(user.isVerified) : "—"}</span></div>
          <div>Role: <span className="font-mono">{user ? user.role : "—"}</span></div>
          <div>Browser: <span className="font-mono">{typeof window !== "undefined" ? window.navigator.userAgent : ""}</span></div>
          <div>Status: <span className="font-mono">{loading ? "Loading/authenticating..." : (user ? "Authenticated" : "Not logged in or session lost")}</span></div>
          <div className="text-xs pt-2">
            <span className="block">If you are logged out unexpectedly:</span>
            <ul className="list-disc ml-6">
              <li>Check if you're using Incognito, or cookies/storage are being cleared</li>
              <li>If your email isn't verified, login won't persist</li>
              <li>Browser add-ons may interfere with session</li>
              <li>Network issues may force auto sign out</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Admin Dashboard */}
      <AdminDashboard
        totalUsers={totalUsers}
        todaysPosts={todaysPosts}
        emergencyNotices={emergencyNotices}
        pendingPosts={pendingPosts}
      />
      <Separator className="my-4" />

      {/* Local Information Management Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{language === "bn" ? "স্থানীয় তথ্য ব্যবস্থাপনা" : "Local Information Management"}</h2>
        <div className="mb-8">
          <LocalInfoAdminPanel
            localInfoCategories={localInfoCategories}
            localInfoTab={localInfoTab}
            setLocalInfoTab={setLocalInfoTab}
          />
        </div>
      </section>
      <Separator className="my-4" />

      {/* Marketplace Manager Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{language === "bn" ? "মার্কেটপ্লেস ব্যবস্থাপনা" : "Marketplace Management"}</h2>
        <MarketplaceManager />
      </section>
      <Separator className="my-4" />

      {/* Post & User Management Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{language === "bn" ? "পোস্ট ও ইউজার ব্যবস্থাপনা" : "Post & User Management"}</h2>
        <PostManagementPanel />
      </section>
      <Separator className="my-4" />

      {/* Market Rates Management Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{language === "bn" ? "বাজারদর ব্যবস্থাপনা" : "Market Rate Management"}</h2>
        <MarketRatePanel />
      </section>
    </div>
  );
}
