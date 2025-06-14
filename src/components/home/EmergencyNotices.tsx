import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle, Zap, Droplets, Cloud } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export const EmergencyNotices = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { notices } = useData();

  const getIcon = (type: string) => {
    switch (type) {
      case "electricity": return Zap;
      case "weather": return Cloud;
      case "gas": return Droplets;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "এইমাত্র";
    if (hours < 24) return `${hours} ঘন্টা আগে`;
    return `${Math.floor(hours / 24)} দিন আগে`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % notices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  useEffect(() => {
    if (notices.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [notices.length]);

  if (notices.length === 0) {
    return (
      <Card className="shadow-lg border-l-4 border-l-green-500 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">কোনো জরুরি বিজ্ঞপ্তি নেই</p>
        </CardContent>
      </Card>
    );
  }

  const currentNotice = notices[currentIndex];
  const IconComponent = getIcon(currentNotice.type);

  return (
    <div className="relative">
      <Card className="shadow-lg border-l-4 border-l-red-500 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className={`p-3 rounded-lg ${getSeverityColor(currentNotice.severity)} text-white ${currentNotice.severity === 'high' ? 'animate-pulse' : ''}`}>
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
                <span className="text-sm text-gray-500">{getTimeAgo(currentNotice.createdAt)}</span>
              </div>
            </div>
            
            {notices.length > 1 && (
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm" onClick={prevSlide}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500">{currentIndex + 1}/{notices.length}</span>
                <Button variant="ghost" size="sm" onClick={nextSlide}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Indicators */}
          {notices.length > 1 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
