
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, TrendingUp, Newspaper, Star } from "lucide-react";

export const LocalInfo = () => {
  const marketPrices = [
    { item: "চাল (মিনিকেট)", price: "৫৮-৬২", unit: "কেজি", trend: "up" },
    { item: "পেঁয়াজ", price: "৪৫-৫০", unit: "কেজি", trend: "down" },
    { item: "ডিম", price: "১৩০-১৪০", unit: "১২টি", trend: "up" },
    { item: "ব্রয়লার মুরগি", price: "১৬০-১৮০", unit: "কেজি", trend: "stable" },
  ];

  const localNews = [
    {
      title: "নতুন স্বাস্থ্য কমপ্লেক্স উদ্বোধন",
      time: "২ ঘন্টা আগে",
      category: "স্বাস্থ্য",
      priority: "high"
    },
    {
      title: "কৃষক প্রশিক্ষণ কর্মসূচি আয়োজন",
      time: "৫ ঘন্টা আগে",
      category: "কৃষি",
      priority: "medium"
    },
    {
      title: "ডিজিটাল সেন্টার নতুন সেবা চালু",
      time: "১ দিন আগে",
      category: "প্রযুক্তি",
      priority: "low"
    }
  ];

  const upcomingEvents = [
    {
      title: "মুক্তিযুদ্ধ দিবস অনুষ্ঠান",
      date: "১৬ ডিসেম্বর",
      location: "উপজেলা পরিষদ",
      type: "national"
    },
    {
      title: "কৃষি মেলা",
      date: "২০ ডিসেম্বর",
      location: "কেন্দ্রীয় মাঠ",
      type: "local"
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === "down") return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    return <div className="h-3 w-3 bg-gray-400 rounded-full"></div>;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "from-red-500 to-pink-500";
      case "medium": return "from-yellow-500 to-orange-500";
      case "low": return "from-blue-500 to-indigo-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getEventTypeColor = (type: string) => {
    return type === "national" ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Market Prices */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-100 dark:border-emerald-800/30">
          <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-400">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            আজকের বাজার দর
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {marketPrices.map((item, index) => (
              <div 
                key={item.item} 
                className="group flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-emerald-100/50 dark:border-emerald-800/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  {getTrendIcon(item.trend)}
                  <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.item}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">৳{item.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Local News */}
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-100 dark:border-blue-800/30">
          <CardTitle className="flex items-center text-blue-800 dark:text-blue-400">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            স্থানীয় সংবাদ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {localNews.map((news, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getPriorityColor(news.priority)}`}></div>
                <div className="p-4 pl-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs bg-gradient-to-r ${getPriorityColor(news.priority)} text-white border-0`}
                    >
                      {news.category}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
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
      <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-100 dark:border-purple-800/30">
          <CardTitle className="flex items-center text-purple-800 dark:text-purple-400">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            আসন্ন অনুষ্ঠান
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="group p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-purple-100/50 dark:border-purple-800/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className={`ml-3 w-3 h-3 bg-gradient-to-r ${getEventTypeColor(event.type)} rounded-full animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
