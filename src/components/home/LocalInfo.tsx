
import React, { useRef, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { useLocation } from "@/contexts/LocationContext";
import { t } from "@/lib/translations";
import LocalInfoQuickAccess from "./LocalInfoQuickAccess";
import { Switch } from "@/components/ui/switch";
import { CategorySection } from "./CategorySection";
import { LocalInfoItem } from "@/types/localInfo";

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
    <div className="container py-4 md:py-8">
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
          <div className="text-center py-10 text-lg text-gray-500">
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
    </div>
  );
};
