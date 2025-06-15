import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocalInfoQuickAccess from "./LocalInfoQuickAccess";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { useLocation } from "@/contexts/LocationContext";
import { t } from "@/lib/translations";
import { LocalInfoItem } from "@/types/localInfo";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const categoryList = [
  { id: "education", i18n: "education" },
  { id: "health", i18n: "health" },
  { id: "transport", i18n: "transport" },
  { id: "utilities", i18n: "utilities" },
  { id: "weather", i18n: "weather" },
  { id: "projects", i18n: "projects" },
  { id: "agriculture", i18n: "agriculture" },
  // Add more as needed, keeping IDs as in types/localInfo.ts
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

// Category quick-access cards
export const LocalInfo = () => {
  const { language } = useApp();
  const { localInfoItems, loading } = useData();
  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [showOnlyMyArea, setShowOnlyMyArea] = useState(true);

  // For scroll-to-category animation
  const sectionRefs = useRef<Record<CategoryId, HTMLDivElement | null>>({} as Record<CategoryId, HTMLDivElement | null>);

  // On category card click, set and scroll to relevant section
  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setTimeout(() => {
      const ref = sectionRefs.current[catId];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Build a filtered category list with i18n
  const quickAccessCategories = categoryList.map((cat) => ({
    id: cat.id,
    label: t(cat.i18n as any, language),
  }));

  // Utility: Get item title/subtitle by category, using type guards to avoid TS errors
  const getItemDisplay = (item: LocalInfoItem) => {
    switch (item.categoryId) {
      case "education":
        return {
          title: item.institutionName,
          subtitle: item.type,
        };
      case "health":
        return {
          title: item.name,
          subtitle: item.type,
        };
      case "private_health":
        return {
          title: item.name,
          subtitle: item.specialty,
        };
      case "transport":
        return {
          title: item.routeName,
          subtitle: item.type,
        };
      case "utilities":
        return {
          title: item.serviceType,
          subtitle: item.officeAddress,
        };
      case "weather":
        return {
          title: item.area,
          subtitle: item.temperature,
        };
      case "projects":
        return {
          title: item.projectName,
          subtitle: item.implementingAgency,
        };
      case "housing":
        return {
          title: item.projectName,
          subtitle: item.contact || item.details,
        };
      case "agriculture":
        return {
          title: item.serviceType,
          subtitle: item.details || item.contact,
        };
      case "jobs":
        return {
          title: item.title,
          subtitle: item.company,
        };
      case "scholarship":
        return {
          title: item.title,
          subtitle: item.provider,
        };
      case "legal":
        return {
          title: item.serviceName,
          subtitle: item.provider,
        };
      case "digital_services":
        return {
          title: item.centerName,
          subtitle: item.services,
        };
      case "culture":
        return {
          title: item.eventName,
          subtitle: item.location,
        };
      case "emergency_news":
        return {
          title: item.title,
          subtitle: item.date,
        };
      case "announcements":
        return {
          title: item.title,
          subtitle: item.date,
        };
      case "admin":
        return {
          title: item.officeName,
          subtitle: item.officerName,
        };
      default:
        return {
          title: 'Unknown',
          subtitle: '',
        };
    }
  };

  const matchesMyArea = (item: LocalInfoItem) =>
    item.district === location.district && item.upazila === location.upazila;

  // Cards render function per category
  const renderCategorySection = (cat: typeof categoryList[number]) => {
    // Filter localInfoItems for the current category (and optionally by area)
    const filtered = localInfoItems.filter(i =>
      i.categoryId === cat.id && (!showOnlyMyArea || matchesMyArea(i))
    );
    if (filtered.length === 0) return null;
    return (
      <div
        key={cat.id}
        ref={el => (sectionRefs.current[cat.id as CategoryId] = el)}
        className="mb-10"
        id={`cat-${cat.id}`}
      >
        <Card className="border-0 rounded-2xl shadow-2xl glass-morphism mb-2 animate-fade-in">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t(cat.i18n as any, language)}</CardTitle>
            {/* Removed incorrect t("category", ...) usage */}
            {/* <Badge variant="secondary" className="ml-2">
              {t("category", language)}
            </Badge> */}
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[220px] w-full">
              <ul className="space-y-2">
                {filtered.map((item) => {
                  const { title, subtitle } = getItemDisplay(item);
                  return (
                    <li key={item.id} className="p-3 bg-white/80 dark:bg-gray-800/70 rounded-xl shadow hover:scale-[1.025] transition">
                      <div className="font-medium text-primary">{title}</div>
                      {subtitle && (
                        <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{subtitle}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{t("localInformation", language)}</h1>
        {/* Area toggle */}
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
      {/* QuickAccess category cards */}
      <LocalInfoQuickAccess
        categories={quickAccessCategories}
        activeCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      {/* Category sections */}
      <div className="mt-2">
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-500">
            {language === "bn" ? "তথ্য লোড হচ্ছে..." : "Loading local info..."}
          </div>
        ) : (
          // Only show the selected category, or if none is selected show all
          (selectedCategory
            ? categoryList.filter(c => c.id === selectedCategory)
            : categoryList
          ).map(renderCategorySection)
        )}
      </div>
    </div>
  );
};
