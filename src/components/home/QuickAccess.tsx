
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText, Users, MessageSquare, Briefcase, DollarSign, Building, Phone } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Link } from "react-router-dom";

export const QuickAccess = () => {
  const { language } = useApp();

  const services = [
    { 
      icon: MapPin, 
      label: t("map", language), 
      color: "from-blue-500 to-cyan-500", 
      shadowColor: "shadow-blue-500/30",
      href: "/map" 
    },
    { 
      icon: FileText, 
      label: t("notices", language), 
      color: "from-red-500 to-pink-500", 
      shadowColor: "shadow-red-500/30",
      href: "/notices" 
    },
    { 
      icon: Users, 
      label: t("social", language), 
      color: "from-emerald-500 to-green-500", 
      shadowColor: "shadow-emerald-500/30",
      href: "/social" 
    },
    { 
      icon: MessageSquare, 
      label: t("qa", language), 
      color: "from-purple-500 to-violet-500", 
      shadowColor: "shadow-purple-500/30",
      href: "/qa" 
    },
    { 
      icon: Briefcase, 
      label: t("jobs", language), 
      color: "from-orange-500 to-amber-500", 
      shadowColor: "shadow-orange-500/30",
      href: "/jobs" 
    },
    { 
      icon: DollarSign, 
      label: language === 'bn' ? "বাজার দর" : "Market Rates", 
      color: "from-yellow-400 to-yellow-500", 
      shadowColor: "shadow-yellow-400/30",
      href: "/market" 
    },
    { 
      icon: Building, 
      label: language === 'bn' ? "উপজেলা তথ্য" : "Local Information", 
      color: "from-indigo-500 to-sky-500", 
      shadowColor: "shadow-indigo-500/30",
      href: "/local-info" 
    },
    { 
      icon: Phone, 
      label: language === 'bn' ? "জরুরি নম্বর" : "Emergency Numbers", 
      color: "from-rose-500 to-red-600", 
      shadowColor: "shadow-rose-500/30",
      href: "/emergency" 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
      {services.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <Link key={service.label} to={service.href} className="group">
            <Card 
              className={`hover-lift cursor-pointer border-0 glass-morphism rounded-2xl overflow-hidden animate-fade-in hover:${service.shadowColor} transition-all duration-300`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardContent className="p-5 text-center relative flex flex-col items-center justify-center aspect-square">
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>
                
                <div className={`relative bg-gradient-to-br ${service.color} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <IconComponent className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 leading-tight">
                  {service.label}
                </h3>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
