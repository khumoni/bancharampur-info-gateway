
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocalInfoQuickAccess from "./LocalInfoQuickAccess";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

// LocalInfo categories (with id and translation key)
const categoryList = [
  { id: "education", i18n: "education" },
  { id: "health", i18n: "health" },
  { id: "transport", i18n: "transport" },
  { id: "utilities", i18n: "utilities" },
  { id: "weather", i18n: "weather" },
  { id: "projects", i18n: "projects" },
  { id: "agriculture", i18n: "agriculture" },
  // Add more as needed
];

export const LocalInfo = () => {
  const { language } = useApp();
  const { localInfoItems, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // For scroll-to-category animation
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // On category card click, set and scroll to relevant section
  const handleCategoryClick = (catId: string) => {
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
    label: t(cat.i18n, language),
  }));

  // Cards render function per category
  const renderCategorySection = (cat: typeof categoryList[0]) => {
    // Filter localInfoItems for the current category
    const filtered = localInfoItems.filter(i => i.categoryId === cat.id);
    if (filtered.length === 0) return null;
    return (
      <div
        key={cat.id}
        ref={el => (sectionRefs.current[cat.id] = el)}
        className="mb-10"
        id={`cat-${cat.id}`}
      >
        <Card className="border-0 rounded-2xl shadow-2xl glass-morphism mb-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t(cat.i18n, language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[220px] w-full">
              <ul className="space-y-2">
                {filtered.map((item) => (
                  <li key={item.id} className="p-3 bg-white/80 dark:bg-gray-800/70 rounded-xl shadow hover:scale-[1.025] transition">
                    {/* Flexible view of key info based on type */}
                    <div className="font-medium text-primary">{item?.title || item?.name || item?.institutionName || item?.eventName || item?.projectName}</div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {/* Show secondary info if available */}
                      {(item as any)?.location ||
                        (item as any)?.type ||
                        (item as any)?.company ||
                        (item as any)?.contact ||
                        (item as any)?.provider ||
                        (item as any)?.details}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{t("localInformation", language)}</h1>
      {/* QuickAccess category cards */}
      <LocalInfoQuickAccess
        categories={quickAccessCategories}
        activeCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      {/* Category sections */}
      <div className="mt-2">
        {loading ? (
          <div className="text-center py-10 text-lg text-gray-500">তথ্য লোড হচ্ছে...</div>
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

