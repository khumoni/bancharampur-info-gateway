
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Heart, Bus, Cloud, Hammer, Leaf, Lightbulb } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string; // tailwind gradient
  shadow: string; // shadow color
}

interface AdminQuickActionsProps {
  categories: {
    id: string;
    label: string;
    // extendable for icon etc.
  }[];
  onCategoryClick: (catId: string) => void;
}

// FIX: Remove the incorrect type that expects an "id" property on each entry.
const categoryMeta: Record<
  string,
  {
    icon: React.ElementType;
    color: string; // tailwind gradient
    shadow: string; // shadow color
  }
> = {
  education:    { icon: Book,       color: "from-blue-500 to-cyan-500",    shadow: "shadow-blue-400/30" },
  health:       { icon: Heart,      color: "from-emerald-500 to-green-500",shadow: "shadow-emerald-400/30" },
  transport:    { icon: Bus,        color: "from-orange-500 to-amber-500", shadow: "shadow-orange-400/30" },
  weather:      { icon: Cloud,      color: "from-sky-400 to-blue-400",     shadow: "shadow-sky-400/30" },
  projects:     { icon: Hammer,     color: "from-purple-500 to-violet-500",shadow: "shadow-purple-400/30" },
  agriculture:  { icon: Leaf,       color: "from-green-600 to-green-300",  shadow: "shadow-green-200/30" },
  utilities:    { icon: Lightbulb,  color: "from-yellow-400 to-yellow-500",shadow: "shadow-yellow-300/30" },
  // fallback for unknown types:
  default:      { icon: Book,       color: "from-gray-400 to-gray-600",    shadow: "shadow-gray-400/20" }
};

export const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  categories,
  onCategoryClick,
}) => {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
        স্থানীয় তথ্য আপডেট করার জন্য বিভাগ নির্বাচন করুন
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {categories.slice(0, 8).map((cat, idx) => {
          const info = categoryMeta[cat.id] || categoryMeta["default"];
          const Icon = info.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={`
                group relative overflow-hidden rounded-2xl 
                transition-all duration-300 border-0 glass-morphism
                shadow-md hover:scale-105 focus:scale-105 outline-none
                ${info.shadow}
                animate-fade-in
              `}
              style={{ animationDelay: `${idx * 0.07}s` }}
              type="button"
            >
              <Card className="border-0 rounded-2xl bg-transparent">
                <CardContent className="flex flex-col items-center py-7 px-2 text-center relative aspect-square">
                  {/* Gradient Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${info.color} opacity-70 group-hover:opacity-90
                    transition-opacity duration-300 rounded-2xl z-0
                  `}></div>
                  {/* Icon Container */}
                  <div className={`
                    relative z-10 bg-white/30 dark:bg-black/20
                    w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-3
                    flex items-center justify-center shadow-lg
                  `}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow" />
                  </div>
                  {/* Label */}
                  <span className="z-10 font-semibold text-xs sm:text-sm text-white drop-shadow">
                    {cat.label}
                  </span>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
};
