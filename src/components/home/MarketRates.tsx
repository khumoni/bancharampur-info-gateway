
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2, TrendingUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const MarketRates = () => {
  const { marketRates, loading } = useData();
  const { language } = useApp();

  return (
    <Card className="shadow-2xl border-0 glass-morphism rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-700/20 dark:to-green-700/20 border-b border-emerald-100/50 dark:border-emerald-800/50">
        <CardTitle className="flex items-center text-xl">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3 shadow-md">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="text-gradient font-semibold">
            {language === 'bn' ? "আজকের বাজার দর" : "Today's Market Rates"} 
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500 dark:text-emerald-400" />
              <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-emerald-500/30 dark:border-emerald-400/30 animate-ping"></div>
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {t("loading", language)}
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {marketRates.slice(0, 5).map((rate, index) => (
              <div 
                key={(rate as any).id} 
                className="group flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.03] border border-emerald-200/70 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${(rate as any).trend === "up" ? "bg-green-500" : (rate as any).trend === "down" ? "bg-red-500" : "bg-yellow-500"}`}></div>
                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {(rate as any).item}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                     {(rate as any).trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                     {(rate as any).trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                    <span className={`font-bold text-lg ${(rate as any).trend === "up" ? "text-green-600 dark:text-green-400" : (rate as any).trend === "down" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                      ৳{(rate as any).price}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">/{(rate as any).unit}</span>
                </div>
              </div>
            ))}
            {marketRates.length > 0 && (
              <div className="text-center pt-3 mt-3 border-t border-emerald-100/70 dark:border-emerald-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-emerald-100/70 dark:bg-emerald-800/30 px-3 py-1 rounded-full">
                  {language === 'bn' ? `সর্বশেষ আপডেট: ${(marketRates[0] as any)?.lastUpdated}` : `Last updated: ${(marketRates[0]as any)?.lastUpdated}`}
                </span>
              </div>
            )}
            {marketRates.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center opacity-70">
                  <DollarSign className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t("noMarketRatesFound", language)}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

