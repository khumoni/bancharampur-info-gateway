
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText, Users, MessageSquare, Briefcase, DollarSign, Building, Phone, Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";
import { Link } from "react-router-dom";
import { trackServiceAccess } from "@/services/analytics";

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
      icon: Video, 
      label: language === 'bn' ? "ভিডিও দেখুন" : "Watch Videos", 
      color: "from-pink-500 to-rose-500", 
      shadowColor: "shadow-pink-500/30",
      href: "/videos" 
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4 sm:gap-6">
      {services.map((service, index) => {
        const IconComponent = service.icon;
        return (
          <Link 
            key={service.label} 
            to={service.href} 
            className="group"
            onClick={() => trackServiceAccess(service.label)}
          >
            <Card 
              className="relative overflow-hidden rounded-2xl border-0 bg-card hover:bg-accent/5 transition-all duration-300 hover-lift shadow-lg hover:shadow-xl animate-fade-in group"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <CardContent className="p-4 text-center relative flex flex-col items-center justify-center aspect-square">
                {/* Facebook-like background circle */}
                <div className={`relative bg-gradient-to-br ${service.color} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300 leading-tight">
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
