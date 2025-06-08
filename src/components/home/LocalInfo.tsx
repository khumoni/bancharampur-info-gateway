
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, TrendingUp } from "lucide-react";

export const LocalInfo = () => {
  const marketPrices = [
    { item: "চাল (মিনিকেট)", price: "৫৮-৬২", unit: "কেজি" },
    { item: "পেঁয়াজ", price: "৪৫-৫০", unit: "কেজি" },
    { item: "ডিম", price: "১৩০-১৪০", unit: "১২টি" },
    { item: "ব্রয়লার মুরগি", price: "১৬০-১৮০", unit: "কেজি" },
  ];

  const localNews = [
    {
      title: "নতুন স্বাস্থ্য কমপ্লেক্স উদ্বোধন",
      time: "২ ঘন্টা আগে",
      category: "স্বাস্থ্য"
    },
    {
      title: "কৃষক প্রশিক্ষণ কর্মসূচি আয়োজন",
      time: "৫ ঘন্টা আগে",
      category: "কৃষি"
    },
    {
      title: "ডিজিটাল সেন্টার নতুন সেবা চালু",
      time: "১ দিন আগে",
      category: "প্রযুক্তি"
    }
  ];

  const upcomingEvents = [
    {
      title: "মুক্তিযুদ্ধ দিবস অনুষ্ঠান",
      date: "১৬ ডিসেম্বর",
      location: "উপজেলা পরিষদ"
    },
    {
      title: "কৃষি মেলা",
      date: "২০ ডিসেম্বর",
      location: "কেন্দ্রীয় মাঠ"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Market Prices */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <TrendingUp className="mr-2 h-5 w-5" />
            আজকের বাজার দর
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketPrices.map((item) => (
              <div key={item.item} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.item}</span>
                <div className="text-right">
                  <span className="font-bold text-green-600">৳{item.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local News */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Calendar className="mr-2 h-5 w-5" />
            স্থানীয় সংবাদ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localNews.map((news, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4 py-2">
                <h4 className="font-medium text-gray-800 mb-1">{news.title}</h4>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {news.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <Calendar className="mr-2 h-5 w-5" />
            আসন্ন অনুষ্ঠান
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{event.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
