
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";

export const MarketRates = () => {
  const { marketRates, loading } = useData();
  const { language } = useApp();

  return (
    <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-100 dark:border-emerald-800/30">
        <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-400">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          {language === 'bn' ? "আজকের বাজার দর" : "Today's Market Rates"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <div className="absolute inset-0 h-8 w-8 animate-ping bg-emerald-500 rounded-full opacity-20"></div>
            </div>
            <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">
              {language === 'bn' ? "লোড হচ্ছে..." : "Loading..."}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {marketRates.slice(0, 5).map((rate, index) => (
              <div 
                key={rate.id} 
                className="group flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-emerald-100/50 dark:border-emerald-800/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {rate.item}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                      ৳{rate.price}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/{rate.unit}</span>
                </div>
              </div>
            ))}
            {marketRates.length > 0 && (
              <div className="text-center pt-4 border-t border-emerald-100 dark:border-emerald-800/30">
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                  {language === 'bn' ? `সর্বশেষ আপডেট: ${marketRates[0]?.lastUpdated}` : `Last updated: ${marketRates[0]?.lastUpdated}`}
                </span>
              </div>
            )}
            {marketRates.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {language === 'bn' ? "কোনো বাজার দর পাওয়া যায়নি" : "No market rates found"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
