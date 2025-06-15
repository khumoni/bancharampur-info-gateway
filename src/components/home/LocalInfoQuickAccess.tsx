
import React from "react";
import {
  Book, Heart, Bus, Cloud, Hammer, Leaf, Zap, Building2, 
  Megaphone, BadgePercent, Gavel, Home, Monitor, Palette, 
  Stethoscope, Newspaper, Briefcase
} from "lucide-react";

const categoryMeta: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    shadow: string;
  }
> = {
  education:        { icon: Book,         color: "from-blue-500 to-cyan-500",      shadow: "shadow-blue-400/30" },
  health:           { icon: Heart,        color: "from-emerald-500 to-green-500",  shadow: "shadow-emerald-400/30" },
  private_health:   { icon: Stethoscope,  color: "from-teal-500 to-emerald-400",   shadow: "shadow-teal-400/30" },
  transport:        { icon: Bus,          color: "from-orange-500 to-amber-500",   shadow: "shadow-orange-400/30" },
  weather:          { icon: Cloud,        color: "from-sky-400 to-blue-400",       shadow: "shadow-sky-400/30" },
  projects:         { icon: Hammer,       color: "from-purple-500 to-violet-500",  shadow: "shadow-purple-400/30" },
  agriculture:      { icon: Leaf,         color: "from-green-600 to-green-300",    shadow: "shadow-green-200/30" },
  utilities:        { icon: Zap,          color: "from-yellow-400 to-yellow-500",  shadow: "shadow-yellow-300/30" },
  admin:            { icon: Building2,    color: "from-indigo-400 to-indigo-700",  shadow: "shadow-indigo-400/30" },
  // FIXED: Use Megaphone instead of Announcements
  announcements:    { icon: Megaphone,    color: "from-rose-400 to-pink-500",      shadow: "shadow-pink-300/20" },
  scholarship:      { icon: BadgePercent, color: "from-cyan-500 to-teal-400",      shadow: "shadow-cyan-400/20" },
  legal:            { icon: Gavel,        color: "from-gray-600 to-gray-900",      shadow: "shadow-gray-400/20" },
  housing:          { icon: Home,         color: "from-purple-400 to-fuchsia-400", shadow: "shadow-purple-300/20" },
  digital_services: { icon: Monitor,      color: "from-sky-600 to-sky-400",        shadow: "shadow-sky-400/30" },
  culture:          { icon: Palette,      color: "from-pink-400 to-red-400",       shadow: "shadow-pink-300/30" },
  emergency_news:   { icon: Newspaper,    color: "from-red-500 to-red-700",        shadow: "shadow-red-400/30" },
  jobs:             { icon: Briefcase,    color: "from-stone-400 to-emerald-600",  shadow: "shadow-stone-300/20" }
};

export interface LocalInfoCategory {
  id: string;
  label: string;
}

interface LocalInfoQuickAccessProps {
  categories: LocalInfoCategory[];
  activeCategory?: string | null;
  onCategoryClick: (id: string) => void;
}

export const LocalInfoQuickAccess: React.FC<LocalInfoQuickAccessProps> = ({
  categories,
  activeCategory,
  onCategoryClick
}) => (
  <div>
    <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-800">
      বিভাগ বাছাই করুন:
    </h2>
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-5">
      {categories.map((cat, idx) => {
        const info = categoryMeta[cat.id] || {
          icon: Book, color: "from-gray-400 to-gray-600", shadow: "shadow-gray-400/20"
        };
        const Icon = info.icon;
        const selected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-150 glass-morphism border-0 shadow-md active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-primary/30 outline-none
            ${info.shadow} ${selected ? "ring-4 ring-primary/50" : ""}`}
            style={{ animationDelay: `${idx * 0.06}s` }}
            type="button"
            aria-pressed={selected}
          >
            <div className="flex flex-col items-center py-4 px-2 text-center relative aspect-square w-full min-h-[72px] sm:min-h-[96px]">
              <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-80 group-active:opacity-95 transition-opacity rounded-2xl z-0`} />
              <div className="relative z-10 bg-white/40 w-12 h-12 md:w-14 md:h-14 rounded-2xl mb-2 flex items-center justify-center shadow-lg">
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow" />
              </div>
              <span className="z-10 font-semibold text-xs sm:text-sm text-white drop-shadow">
                {cat.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default LocalInfoQuickAccess;
