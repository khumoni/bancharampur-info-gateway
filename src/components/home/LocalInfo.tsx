import React, { useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { useLocation } from "@/contexts/LocationContext";
import { t } from "@/lib/translations";
import LocalInfoQuickAccess from "./LocalInfoQuickAccess";
import { Switch } from "@/components/ui/switch";
import { CategorySection } from "./CategorySection";
import { LocalInfoItem } from "@/types/localInfo";
import LocationSelectorDialog from "@/components/location/LocationSelectorDialog";

const categoryList = [
  { id: "education", i18n: "education" },
  { id: "health", i18n: "health" },
  { id: "transport", i18n: "transport" },
  { id: "utilities", i18n: "utilities" },
  { id: "weather", i18n: "weather" },
  { id: "projects", i18n: "projects" },
  { id: "agriculture", i18n: "agriculture" },
  { id: "admin", i18n: "admin" },
  { id: "announcements", i18n: "announcements" },
  { id: "scholarship", i18n: "scholarship" },
  { id: "legal", i18n: "legal" },
  { id: "housing", i18n: "housing" },
  { id: "digital_services", i18n: "digitalServices" },
  { id: "culture", i18n: "culture" },
  { id: "private_health", i18n: "privateHealth" },
  { id: "emergency_news", i18n: "emergencyNews" },
  { id: "jobs", i18n: "jobs" }
] as const;

type CategoryId = typeof categoryList[number]["id"];

// Main LocalInfo Component
export const LocalInfo = () => {
  const { language } = useApp();
  const { localInfoItems, loading } = useData();
  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [showOnlyMyArea, setShowOnlyMyArea] = useState(true);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  // Store refs to each category for smooth scroll
  const sectionRefs = useRef<Record<CategoryId, HTMLDivElement | null>>({} as Record<CategoryId, HTMLDivElement | null>);

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setTimeout(() => {
      const ref = sectionRefs.current[catId];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const quickAccessCategories = categoryList.map((cat) => ({
    id: cat.id,
    label: t(cat.i18n as any, language),
  }));

  const matchesMyArea = (item: LocalInfoItem) =>
    item.district === location.district && item.upazila === location.upazila;

  const getFilteredItemsByCategory = (catId: CategoryId) =>
    localInfoItems.filter(
      (i) => i.categoryId === catId && (!showOnlyMyArea || matchesMyArea(i))
    );

  return (
    <div className="container py-4 md:py-8 relative">
      {/* Floating location change button removed */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t("localInformation", language)}</h1>
        <div className="flex items-center gap-2">
          <Switch
            checked={showOnlyMyArea}
            onCheckedChange={setShowOnlyMyArea}
            id="area-toggle"
          />
          <label htmlFor="area-toggle" className="text-sm select-none cursor-pointer">
            {showOnlyMyArea
              ? `${location.district}, ${location.upazila} ${language === "bn" ? "এর তথ্য" : "info only"}`
              : language === "bn" ? "সব এলাকার তথ্য" : "Show all areas"}
          </label>
        </div>
      </div>
      <LocalInfoQuickAccess
        categories={quickAccessCategories}
        activeCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      <div className="mt-2">
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-500 animate-fade-in">
            {language === "bn" ? "তথ্য লোড হচ্ছে..." : "Loading local info..."}
          </div>
        ) : (
          (selectedCategory
            ? categoryList.filter(c => c.id === selectedCategory)
            : categoryList
          ).map(cat => (
            <CategorySection
              key={cat.id}
              title={t(cat.i18n as any, language)}
              items={getFilteredItemsByCategory(cat.id as CategoryId)}
              language={language}
              refEl={el => (sectionRefs.current[cat.id as CategoryId] = el)}
            />
          ))
        )}
      </div>

      {/* Location selector modal */}
      {showLocationDialog && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 animate-fade-in">
          {/* Wrapper with click to close */}
          <div className="absolute inset-0" onClick={() => setShowLocationDialog(false)} />
          <div className="relative z-10 w-full max-w-md mx-auto rounded-xl bg-background shadow-2xl animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {language === "bn" ? "আপনার এলাকা পরিবর্তন করুন" : "Change Your Area"}
              </h2>
              <p className="mb-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                {language === "bn"
                  ? "স্থানীয় তথ্য দেখার জন্য জেলা ও উপজেলা নির্বাচন করুন।"
                  : "Select district and upazila to view local info."}
              </p>
              <LocationSelectorDialog
                isOpen={showLocationDialog}
                onOpenChange={setShowLocationDialog}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
