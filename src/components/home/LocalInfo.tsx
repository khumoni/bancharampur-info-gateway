import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, TrendingUp, Newspaper, Star } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const LocalInfo = () => {
  const { language } = useApp();

  const marketPrices = [
    { item: t("riceMiniket", language), price: language === 'bn' ? "৫৮-৬২" : "58-62", unit: t("kg", language), trend: "up" },
    { item: t("onion", language), price: language === 'bn' ? "৪৫-৫০" : "45-50", unit: t("kg", language), trend: "down" },
    { item: t("egg", language), price: language === 'bn' ? "১৩০-১৪০" : "130-140", unit: t("dozen", language), trend: "up" },
    { item: t("broilerChicken", language), price: language === 'bn' ? "১৬০-১৮০" : "160-180", unit: t("kg", language), trend: "stable" },
  ];

  const localNews = [
    {
      title: t("newHealthComplexInaugurated", language),
      time: t("twoHoursAgo", language), // Updated
      category: t("health", language),
      priority: "high"
    },
    {
      title: t("farmerTrainingProgramOrganized", language),
      time: t("fiveHoursAgo", language), // Updated
      category: t("agriculture", language),
      priority: "medium"
    },
    {
      title: t("digitalCenterNewServiceLaunched", language),
      time: t("oneDayAgo", language), // Updated
      category: t("technology", language),
      priority: "low"
    }
  ];

  const upcomingEvents = [
    {
      title: t("liberationDayEvent", language),
      date: t("december16", language),
      location: t("upazilaParishad", language),
      type: "national"
    },
    {
      title: t("agriculturalFair", language),
      date: t("december20", language),
      location: t("centralField", language),
      type: "local"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
    if (trend === "down") return <TrendingUp className="h-3.5 w-3.5 text-red-500 rotate-180" />;
    return <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>; // Stable trend
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "from-red-500 to-pink-600";
      case "medium": return "from-yellow-500 to-orange-600";
      case "low": return "from-sky-500 to-blue-600";
      default: return "from-gray-500 to-gray-600";
    }
  };
  
  const getPriorityPillColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700";
      case "medium": return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
      case "low": return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      default: return "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600";
    }
  };


  const getEventTypeColor = (type: string) => {
    return type === "national" ? "from-red-500/80 to-red-600/80" : "from-blue-500/80 to-blue-600/80";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Market Prices */}
      <Card className="shadow-2xl border-0 glass-morphism rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-700/20 dark:to-green-700/20 border-b border-emerald-100/50 dark:border-emerald-800/50">
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3 shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-gradient font-semibold">
              {t("todaysMarketPrice", language)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {marketPrices.map((item, index) => (
              <div 
                key={item.item} 
                className="group flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/40 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.03] border border-emerald-200/70 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  {getTrendIcon(item.trend)}
                  <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.item}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${item.trend === "up" ? "text-green-600 dark:text-green-400" : item.trend === "down" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`}>৳{item.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Local News */}
      <Card className="shadow-2xl border-0 glass-morphism rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-700/20 dark:to-indigo-700/20 border-b border-blue-100/50 dark:border-blue-800/50">
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-md">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <span className="text-gradient bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 font-semibold">
              {t("localNews", language)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {localNews.map((news, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/40 dark:bg-gray-800/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${getPriorityColor(news.priority)} rounded-l-xl`}></div>
                <div className="p-4 pl-5">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <Badge 
                      variant="outline"
                      className={`text-xs font-medium ${getPriorityPillColor(news.priority)}`}
                    >
                      {news.category}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      {news.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Upcoming Events */}
      <Card className="shadow-2xl border-0 glass-morphism rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-700/20 dark:to-pink-700/20 border-b border-purple-100/50 dark:border-purple-800/50">
          <CardTitle className="flex items-center text-xl">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3 shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
             <span className="text-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 font-semibold">
              {t("upcomingEvents", language)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="group p-4 bg-white/50 dark:bg-gray-800/40 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-purple-200/70 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-0">
                      <span className="flex items-center bg-white/70 dark:bg-gray-700/50 px-2.5 py-1 rounded-lg text-xs font-medium">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center bg-white/70 dark:bg-gray-700/50 px-2.5 py-1 rounded-lg text-xs font-medium">
                        <MapPin className="mr-1.5 h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className={`ml-3 mt-1 w-3 h-3 bg-gradient-to-r ${getEventTypeColor(event.type)} rounded-full animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
