
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText, Users, MessageSquare, Briefcase, DollarSign, Building, Phone } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const QuickAccess = () => {
  const { language } = useApp();

  const services = [
    { icon: MapPin, label: t("map", language), color: "bg-blue-500", href: "/map" },
    { icon: FileText, label: t("notices", language), color: "bg-red-500", href: "/notices" },
    { icon: Users, label: t("social", language), color: "bg-green-500", href: "/social" },
    { icon: MessageSquare, label: t("qa", language), color: "bg-purple-500", href: "/qa" },
    { icon: Briefcase, label: t("jobs", language), color: "bg-orange-500", href: "/jobs" },
    { 
      icon: DollarSign, 
      label: language === 'bn' ? "বাজার দর" : "Market Rates", 
      color: "bg-yellow-500", 
      href: "/market" 
    },
    { 
      icon: Building, 
      label: language === 'bn' ? "সরকারি অফিস" : "Government Offices", 
      color: "bg-indigo-500", 
      href: "/offices" 
    },
    { 
      icon: Phone, 
      label: language === 'bn' ? "জরুরি নম্বর" : "Emergency Numbers", 
      color: "bg-red-600", 
      href: "/emergency" 
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6 text-center">
        {t("quickServices", language)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.label} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className={`${service.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{service.label}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
