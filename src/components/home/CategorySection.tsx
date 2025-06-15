
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocalInfoItem } from "@/types/localInfo";
import { t } from "@/lib/translations";
import { getItemDisplay } from "./useLocalInfoHelpers";

interface CategorySectionProps {
  title: string;
  items: LocalInfoItem[];
  language: string;
  refEl?: React.RefObject<HTMLDivElement>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  language,
  refEl,
}) => {
  if (!items.length) return null;
  return (
    <div className="mb-10" ref={refEl}>
      <Card className="border-0 rounded-2xl shadow-2xl glass-morphism mb-2 animate-fade-in">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[220px] w-full">
            <ul className="space-y-2">
              {items.map((item) => {
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
