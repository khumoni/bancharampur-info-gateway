
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, FileText, Users, MessageSquare, Briefcase, DollarSign, Building, Phone } from "lucide-react";

export const QuickAccess = () => {
  const services = [
    { icon: MapPin, label: "মানচিত্র", color: "bg-blue-500", href: "/map" },
    { icon: FileText, label: "বিজ্ঞপ্তি", color: "bg-red-500", href: "/notices" },
    { icon: Users, label: "সামাজিক", color: "bg-green-500", href: "/social" },
    { icon: MessageSquare, label: "প্রশ্নোত্তর", color: "bg-purple-500", href: "/qa" },
    { icon: Briefcase, label: "চাকরি", color: "bg-orange-500", href: "/jobs" },
    { icon: DollarSign, label: "বাজার দর", color: "bg-yellow-500", href: "/market" },
    { icon: Building, label: "সরকারি অফিস", color: "bg-indigo-500", href: "/offices" },
    { icon: Phone, label: "জরুরি নম্বর", color: "bg-red-600", href: "/emergency" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">দ্রুত সেবা</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.label} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className={`${service.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">{service.label}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
