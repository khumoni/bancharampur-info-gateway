import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LocalInfoItem } from "@/types/localInfo";
import { t } from "@/lib/translations";
import { getItemDisplay } from "./useLocalInfoHelpers";

interface CategorySectionProps {
  title: string;
  items: LocalInfoItem[];
  language: string;
  refEl?: ((el: HTMLDivElement | null) => void); // Accept callback ref
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  language,
  refEl,
}) => {
  if (!items.length) return null;
  return (
    <div className="mb-6 md:mb-10" ref={refEl}>
      <Card className="border-0 rounded-2xl shadow-2xl glass-morphism mb-2 animate-fade-in">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base md:text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[160px] md:max-h-[220px] w-full">
            <ul className="space-y-2">
              {items.map((item) => {
                const { title, subtitle } = getItemDisplay(item);
                return (
                  <li 
                    key={item.id}
                    className="p-2 md:p-3 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow hover:scale-[1.015] transition active:bg-primary/10 focus-visible:bg-primary/10"
                  >
                    <div className="font-medium text-primary truncate">{title}</div>
                    {subtitle && (
                      <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 truncate">{subtitle}</div>
                    )}
                  </li>
                );
