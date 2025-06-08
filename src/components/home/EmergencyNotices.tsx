
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle, Zap, Droplets, Cloud } from "lucide-react";

export const EmergencyNotices = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const notices = [
    {
      id: 1,
      type: "electricity",
      icon: Zap,
      title: "বিদ্যুৎ বিভ্রাট সংক্রান্ত",
      message: "আগামীকাল (১৫ ডিসেম্বর) সকাল ৯টা থেকে বিকেল ৩টা পর্যন্ত রক্ষণাবেক্ষণের কাজে বিদ্যুৎ বন্ধ থাকবে।",
      severity: "high",
      time: "২ ঘন্টা আগে"
    },
    {
      id: 2,
      type: "weather",
      icon: Cloud,
      title: "আবহাওয়া সতর্কতা",
      message: "আগামী ৪৮ ঘন্টায় ভারী বৃষ্টিপাত ও বজ্রসহ বৃষ্টির সম্ভাবনা। সবাই সতর্ক থাকুন।",
      severity: "medium",
      time: "৫ ঘন্টা আগে"
    },
    {
      id: 3,
      type: "gas",
      icon: Droplets,
      title: "গ্যাস সরবরাহ",
      message: "পাইপ লাইন মেরামতের কারণে আজ রাত ১২টা থেকে সকাল ৬টা পর্যন্ত গ্যাস সরবরাহ বন্ধ থাকবে।",
      severity: "medium",
      time: "১ দিন আগে"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % notices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentNotice = notices[currentIndex];
  const IconComponent = currentNotice.icon;

  return (
    <div className="relative">
      <Card className="shadow-lg border-l-4 border-l-red-500 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`p-3 rounded-lg ${getSeverityColor(currentNotice.severity)} text-white`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-red-800">{currentNotice.title}</h3>
                  <Badge variant={currentNotice.severity === "high" ? "destructive" : "secondary"}>
                    {currentNotice.severity === "high" ? "জরুরি" : "গুরুত্বপূর্ণ"}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3">{currentNotice.message}</p>
                <span className="text-sm text-gray-500">{currentNotice.time}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="ghost" size="sm" onClick={prevSlide}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">{currentIndex + 1}/{notices.length}</span>
              <Button variant="ghost" size="sm" onClick={nextSlide}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {notices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-red-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
