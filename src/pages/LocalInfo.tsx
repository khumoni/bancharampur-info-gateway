import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/contexts/AppContext";
import { useLocation } from "@/contexts/LocationContext";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Heart, 
  Bus, 
  Building, 
  Zap, 
  Cloud, 
  Briefcase, 
  Megaphone,
  Award,
  Scale,
  Sprout,
  Home,
  Smartphone,
  Music,
  Stethoscope,
  AlertTriangle,
  Users
} from "lucide-react";

const LocalInfo = () => {
  const { language } = useApp();
  const { location } = useLocation();

  // Category configuration with icons and routes
  const infoCategories = [
    {
      id: 'education',
      title: language === 'bn' ? 'শিক্ষা তথ্য' : 'Education',
      description: language === 'bn' ? 'শিক্ষা প্রতিষ্ঠান ও সেবা' : 'Educational institutions and services',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'health',
      title: language === 'bn' ? 'স্বাস্থ্য সেবা' : 'Healthcare',
      description: language === 'bn' ? 'হাসপাতাল ও চিকিৎসা সেবা' : 'Hospitals and medical services',
      icon: Heart,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'transport',
      title: language === 'bn' ? 'পরিবহন' : 'Transportation',
      description: language === 'bn' ? 'বাস, ট্রেন ও অন্যান্য পরিবহন' : 'Bus, train and other transport',
      icon: Bus,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'administrative',
      title: language === 'bn' ? 'প্রশাসনিক তথ্য' : 'Administrative',
      description: language === 'bn' ? 'সরকারি অফিস ও সেবা' : 'Government offices and services',
      icon: Building,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'utilities',
      title: language === 'bn' ? 'ইউটিলিটিজ' : 'Utilities',
      description: language === 'bn' ? 'বিদ্যুৎ, গ্যাস, পানি সেবা' : 'Electricity, gas, water services',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'weather',
      title: language === 'bn' ? 'আবহাওয়া' : 'Weather',
      description: language === 'bn' ? 'আবহাওয়ার তথ্য ও পূর্বাভাস' : 'Weather information and forecast',
      icon: Cloud,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'projects',
      title: language === 'bn' ? 'প্রকল্প সমূহ' : 'Projects',
      description: language === 'bn' ? 'উন্নয়ন প্রকল্প ও পরিকল্পনা' : 'Development projects and plans',
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'announcements',
      title: language === 'bn' ? 'ঘোষণা' : 'Announcements',
      description: language === 'bn' ? 'সরকারি ও স্থানীয় ঘোষণা' : 'Government and local announcements',
      icon: Megaphone,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'scholarship',
      title: language === 'bn' ? 'বৃত্তি' : 'Scholarships',
      description: language === 'bn' ? 'শিক্ষা বৃত্তি ও অনুদান' : 'Educational scholarships and grants',
      icon: Award,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'legal',
      title: language === 'bn' ? 'আইনি সহায়তা' : 'Legal Aid',
      description: language === 'bn' ? 'আইনি পরামর্শ ও সহায়তা' : 'Legal advice and assistance',
      icon: Scale,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'agriculture',
      title: language === 'bn' ? 'কৃষি' : 'Agriculture',
      description: language === 'bn' ? 'কৃষি তথ্য ও পরামর্শ' : 'Agricultural information and advice',
      icon: Sprout,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'housing',
      title: language === 'bn' ? 'আবাসন' : 'Housing',
      description: language === 'bn' ? 'আবাসন সেবা ও তথ্য' : 'Housing services and information',
      icon: Home,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'digital',
      title: language === 'bn' ? 'ডিজিটাল সেবা' : 'Digital Services',
      description: language === 'bn' ? 'অনলাইন সেবা ও তথ্য' : 'Online services and information',
      icon: Smartphone,
      color: 'from-violet-500 to-violet-600'
    },
    {
      id: 'culture',
      title: language === 'bn' ? 'সংস্কৃতি' : 'Culture',
      description: language === 'bn' ? 'সাংস্কৃতিক কার্যক্রম ও তথ্য' : 'Cultural events and information',
      icon: Music,
      color: 'from-rose-500 to-rose-600'
    },
    {
      id: 'private-health',
      title: language === 'bn' ? 'প্রাইভেট স্বাস্থ্য সেবা' : 'Private Healthcare',
      description: language === 'bn' ? 'বেসরকারি চিকিৎসা সেবা' : 'Private medical services',
      icon: Stethoscope,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'emergency',
      title: language === 'bn' ? 'জরুরি সংবাদ' : 'Emergency News',
      description: language === 'bn' ? 'জরুরি তথ্য ও সংবাদ' : 'Emergency information and news',
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700'
    },
    {
      id: 'jobs',
      title: language === 'bn' ? 'চাকরি' : 'Jobs',
      description: language === 'bn' ? 'চাকরির সুযোগ ও তথ্য' : 'Job opportunities and information',
      icon: Users,
      color: 'from-slate-500 to-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            {language === 'bn' ? 'স্থানীয় তথ্য' : 'Local Information'}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {location.district}, {location.upazila}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আপনার প্রয়োজনীয় স্থানীয় তথ্য ও সেবা খুঁজে নিন' 
              : 'Find the local information and services you need'
            }
          </p>
        </div>

        {/* Information Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4 mb-8">
          {infoCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xs font-medium group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {language === 'bn' ? 'আরও তথ্য শীঘ্রই যোগ হবে' : 'More Information Coming Soon'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'bn' 
                ? 'আমরা প্রতিটি বিভাগের জন্য বিস্তারিত তথ্য যোগ করছি।' 
                : 'We are adding detailed information for each category.'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LocalInfo;