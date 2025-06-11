
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText, Users, MessageSquare, Briefcase, DollarSign, Building, Phone } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

export const QuickAccess = () => {
  const { language } = useApp();

  const services = [
    { 
      icon: MapPin, 
      label: t("map", language), 
      color: "from-blue-500 to-blue-600", 
      shadowColor: "shadow-blue-500/25",
      href: "/map" 
    },
    { 
      icon: FileText, 
      label: t("notices", language), 
      color: "from-red-500 to-pink-600", 
      shadowColor: "shadow-red-500/25",
      href: "/notices" 
    },
    { 
      icon: Users, 
      label: t("social", language), 
      color: "from-emerald-500 to-green-600", 
      shadowColor: "shadow-emerald-500/25",
      href: "/social" 
    },
    { 
      icon: MessageSquare, 
      label: t("qa", language), 
      color: "from-purple-500 to-violet-600", 
      shadowColor: "shadow-purple-500/25",
      href: "/qa" 
    },
    { 
      icon: Briefcase, 
      label: t("jobs", language), 
      color: "from-orange-500 to-amber-600", 
      shadowColor: "shadow-orange-500/25",
      href: "/jobs" 
    },
    { 
      icon: DollarSign, 
      label: language === 'bn' ? "বাজার দর" : "Market Rates", 
      color: "from-yellow-500 to-yellow-600", 
      shadowColor: "shadow-yellow-500/25",
      href: "/market" 
    },
    { 
      icon: Building, 
      label: language === 'bn' ? "সরকারি অফিস" : "Government Offices", 
      color: "from-indigo-500 to-blue-600", 
      shadowColor: "shadow-indigo-500/25",
      href: "/offices" 
    },
    { 
      icon: Phone, 
      label: language === 'bn' ? "জরুরি নম্বর" : "Emergency Numbers", 
      color: "from-red-600 to-red-700", 
      shadowColor: "shadow-red-600/25",
      href: "/emergency" 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {services.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <Card 
            key={service.label} 
            className={`group hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden animate-fade-in hover:${service.shadowColor}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6 text-center relative">
              {/* Hover gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 leading-tight">
                {service.label}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
