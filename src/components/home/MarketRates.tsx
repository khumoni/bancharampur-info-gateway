
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";

export const MarketRates = () => {
  const { marketRates } = useData();
  const { language } = useApp();

  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800 dark:text-green-400">
          <DollarSign className="mr-2 h-5 w-5" />
          {language === 'bn' ? "আজকের বাজার দর" : "Today's Market Rates"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketRates.slice(0, 5).map((rate) => (
            <div key={rate.id} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="font-medium text-gray-800 dark:text-gray-200">{rate.item}</span>
              <div className="text-right">
                <span className="font-bold text-green-600 dark:text-green-400">৳{rate.price}</span>
                <span className="text-sm text-gray-500 ml-1">/{rate.unit}</span>
              </div>
            </div>
          ))}
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">
              {language === 'bn' ? `সর্বশেষ আপডেট: ${marketRates[0]?.lastUpdated}` : `Last updated: ${marketRates[0]?.lastUpdated}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
