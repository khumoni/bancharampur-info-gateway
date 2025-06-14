
import { DollarSign, Loader2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const MarketRates = () => {
  const { marketRates, loading } = useData();
  const { language } = useApp();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 dark:text-emerald-400" />
          <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-emerald-500/30 dark:border-emerald-400/30 animate-ping"></div>
        </div>
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          {t("loading", language)}
        </span>
      </div>
    );
  }

  if (marketRates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center opacity-70">
          <DollarSign className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {t("noMarketRatesFound", language)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {marketRates.map((rate, index) => (
        <div
          key={rate.id}
          className="group flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.03] border border-emerald-200/70 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className="flex items-center space-x-3">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {rate.item}
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                ৳{rate.price}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">/{rate.unit}</span>
          </div>
        </div>
      ))}
      {marketRates.length > 0 && (
        <div className="text-center pt-3 mt-3 border-t border-emerald-100/70 dark:border-emerald-800/40">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-emerald-100/70 dark:bg-emerald-800/30 px-3 py-1 rounded-full">
            {language === 'bn' ? `সর্বশেষ আপডেট: ${marketRates[0]?.lastUpdated}` : `Last updated: ${marketRates[0]?.lastUpdated}`}
          </span>
        </div>
      )}
    </div>
  );
};
