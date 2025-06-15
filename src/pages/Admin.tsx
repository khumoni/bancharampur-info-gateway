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

  // Collapsible debug panel state
  const [showDebug, setShowDebug] = useState(false);

  // Handler to open Local Info tab (first category shown by default)
  const handleLocalInfoClick = () => {
    setLocalInfoTab(localInfoCategories[0]?.id || null);
    const infoSection = document.getElementById("local-info-section");
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const { user, loading } = useAuth();

  return (
    <div className="space-y-12 px-1 md:px-6 py-5 max-w-6xl mx-auto w-full">
      {/* DEBUG: Auth Session Diagnostics - Only visible to admin */}
      {user?.isAdmin && (
        <div className="mb-4">
          <button
            className="text-xs font-medium rounded bg-yellow-100 hover:bg-yellow-200 transition px-3 py-1 text-yellow-800 border border-yellow-300 mb-2 w-full flex justify-between items-center"
            onClick={() => setShowDebug((s) => !s)}
            aria-expanded={showDebug}
          >
            <span>Session Debug Panel</span>
            <span className="ml-2">{showDebug ? "▲" : "▼"}</span>
          </button>
          <div
            className={`
              border border-yellow-200 bg-yellow-50 rounded px-4 py-2 text-yellow-900 transition-all 
              ${showDebug ? "max-h-96 opacity-100 mt-0" : "max-h-0 opacity-0 overflow-hidden"}
              text-xs sm:text-sm
            `}
            style={{
              transition: "all 0.35s cubic-bezier(.4,2,.6,1)",
            }}
          >
            <div className="pb-1">
              <span className="font-semibold">User:</span>{" "}
              <span className="font-mono">{user ? user.email : "No user"}</span>
            </div>
            <div>
              <span className="font-semibold">User ID:</span>{" "}
              <span className="font-mono">{user ? user.id : "—"}</span>
            </div>
            <div>
              <span className="font-semibold">Verified:</span>{" "}
              <span className="font-mono">{user ? String(user.isVerified) : "—"}</span>
            </div>
            <div>
              <span className="font-semibold">Role:</span>{" "}
              <span className="font-mono">{user ? user.role : "—"}</span>
            </div>
            <div>
              <span className="font-semibold">Browser:</span>{" "}
              <span className="font-mono">{typeof window !== "undefined" ? window.navigator.userAgent : ""}</span>
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className="font-mono">
                {loading
                  ? "Loading/authenticating..."
                  : user
                  ? "Authenticated"
                  : "Not logged in or session lost"}
              </span>
            </div>
            <div className="pt-2 text-xs">
              <ul className="list-disc ml-5">
                <li>Incognito mode or cleared storage may log you out</li>
                <li>Unverified email won't persist login</li>
                <li>Browser add-ons may interfere</li>
                <li>Network issues can log you out</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      <AdminDashboard
        totalUsers={totalUsers}
        todaysPosts={todaysPosts}
        emergencyNotices={emergencyNotices}
        pendingPosts={pendingPosts}
        onLocalInfoClick={handleLocalInfoClick}
      />
      <Separator className="my-4" />

      {/* Local Information Management Section */}
      <section id="local-info-section">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
          {language === "bn" ? "স্থানীয় তথ্য ব্যবস্থাপনা" : "Local Information Management"}
        </h2>
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
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
          {language === "bn" ? "মার্কেটপ্লেস ব্যবস্থাপনা" : "Marketplace Management"}
        </h2>
        <MarketplaceManager />
      </section>
      <Separator className="my-4" />

      {/* Post & User Management Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
          {language === "bn" ? "পোস্ট ও ইউজার ব্যবস্থাপনা" : "Post & User Management"}
        </h2>
        <PostManagementPanel />
      </section>
      <Separator className="my-4" />

      {/* Market Rates Management Section */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
          {language === "bn" ? "বাজারদর ব্যবস্থাপনা" : "Market Rate Management"}
        </h2>
        <MarketRatePanel />
      </section>
    </div>
  );
}
