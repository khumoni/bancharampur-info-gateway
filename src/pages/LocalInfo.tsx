import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Heart, 
  Bolt, 
  CloudSun, 
  ShoppingCart, 
  HardHat, 
  UserCog, 
  Megaphone,
  Bus,
  Building,
  School,
  Award,
  Bell,
  Users,
  Hospital,
  Stethoscope,
  Pill,
  Ambulance,
  LightbulbOff,
  CreditCard,
  Phone,
  Sun,
  AlertTriangle,
  Shield,
  Fish,
  Carrot,
  Calendar,
  Hammer,
  UserCheck,
  MessageSquare,
  Speaker,
  Clock,
  Route
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/contexts/AppContext";

const LocalInfo = () => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState("education");

  const categories = [
    {
      id: "education",
      icon: GraduationCap,
      title: language === 'bn' ? "শিক্ষা" : "Education",
      color: "from-blue-500 to-blue-600",
      items: [
        {
          icon: Award,
          title: language === 'bn' ? "বৃত্তির তথ্য" : "Scholarship Information",
          description: language === 'bn' ? "সরকারি ও বেসরকারি বৃত্তির তথ্য" : "Government and private scholarship information"
        },
        {
          icon: School,
          title: language === 'bn' ? "স্কুল ও কলেজের তালিকা" : "Schools and Colleges List",
          description: language === 'bn' ? "সরকারি/বেসরকারি শিক্ষা প্রতিষ্ঠানের তালিকা" : "List of government/private educational institutions"
        },
        {
          icon: Bell,
          title: language === 'bn' ? "ভর্তির নোটিশ" : "Admission Notices",
          description: language === 'bn' ? "সকল শিক্ষা প্রতিষ্ঠানের ভর্তি বিজ্ঞপ্তি" : "Admission notifications from all educational institutions"
        },
        {
          icon: Users,
          title: language === 'bn' ? "কোচিং সেন্টার ও মাদ্রাসা" : "Coaching Centers and Madrasas",
          description: language === 'bn' ? "স্থানীয় কোচিং ও ধর্মীয় শিক্ষা প্রতিষ্ঠান" : "Local coaching and religious educational institutions"
        }
      ]
    },
    {
      id: "health",
      icon: Heart,
      title: language === 'bn' ? "স্বাস্থ্য" : "Health",
      color: "from-red-500 to-pink-600",
      items: [
        {
          icon: Hospital,
          title: language === 'bn' ? "উপজেলা স্বাস্থ্য কমপ্লেক্স" : "Upazila Health Complex",
          description: language === 'bn' ? "উপজেলা স্বাস্থ্য কমপ্লেক্সের সম্পূর্ণ তথ্য" : "Complete information about Upazila Health Complex"
        },
        {
          icon: Stethoscope,
          title: language === 'bn' ? "ক্লিনিক ও ডাক্তারের তালিকা" : "Clinics and Doctors List",
          description: language === 'bn' ? "স্থানীয় ক্লিনিক ও ডাক্তারদের তথ্য" : "Information about local clinics and doctors"
        },
        {
          icon: Pill,
          title: language === 'bn' ? "ফার্মেসি" : "Pharmacy Services",
          description: language === 'bn' ? "ওষুধের দোকান ও ফার্মেসির তথ্য" : "Information about medicine shops and pharmacies"
        },
        {
          icon: Ambulance,
          title: language === 'bn' ? "অ্যাম্বুলেন্স সেবা" : "Ambulance Services",
          description: language === 'bn' ? "জরুরি অ্যাম্বুলেন্স সেবার তথ্য" : "Emergency ambulance service information"
        }
      ]
    },
    {
      id: "utilities",
      icon: Bolt,
      title: language === 'bn' ? "বিদ্যুৎ ও গ্যাস" : "Electricity and Gas",
      color: "from-yellow-500 to-orange-600",
      items: [
        {
          icon: LightbulbOff,
          title: language === 'bn' ? "লোডশেডিং আপডেট" : "Loadshedding Updates",
          description: language === 'bn' ? "দৈনিক লোডশেডিং সময়সূচী" : "Daily loadshedding schedule"
        },
        {
          icon: CreditCard,
          title: language === 'bn' ? "বিলিং সেন্টার" : "Billing Center",
          description: language === 'bn' ? "বিদ্যুৎ ও গ্যাস বিল জমার কেন্দ্র" : "Electricity and gas bill payment centers"
        },
        {
          icon: Phone,
          title: language === 'bn' ? "অভিযোগ লিংক/নম্বর" : "Complaint Link/Number",
          description: language === 'bn' ? "বিদ্যুৎ ও গ্যাস সংক্রান্ত অভিযোগ" : "Electricity and gas related complaints"
        }
      ]
    },
    {
      id: "weather",
      icon: CloudSun,
      title: language === 'bn' ? "আবহাওয়া ও দুর্যোগ" : "Weather and Disasters",
      color: "from-cyan-500 to-blue-600",
      items: [
        {
          icon: Sun,
          title: language === 'bn' ? "দৈনিক আবহাওয়া" : "Daily Weather Forecast",
          description: language === 'bn' ? "আজকের এবং আগামীকালের আবহাওয়ার পূর্বাভাস" : "Today's and tomorrow's weather forecast"
        },
        {
          icon: AlertTriangle,
          title: language === 'bn' ? "বন্যা/ঘূর্ণিঝড় সতর্কতা" : "Flood/Cyclone Alerts",
          description: language === 'bn' ? "প্রাকৃতিক দুর্যোগের সতর্কবার্তা" : "Natural disaster warning alerts"
        },
        {
          icon: Shield,
          title: language === 'bn' ? "দুর্যোগ ব্যবস্থাপনা টিপস" : "Disaster Management Tips",
          description: language === 'bn' ? "দুর্যোগকালীন করণীয় ও পরামর্শ" : "Disaster preparedness and management advice"
        }
      ]
    },
    {
      id: "market",
      icon: ShoppingCart,
      title: language === 'bn' ? "স্থানীয় বাজারদর" : "Local Market Prices",
      color: "from-green-500 to-emerald-600",
      items: [
        {
          icon: Fish,
          title: language === 'bn' ? "চাল, ডাল, সবজি, মাছ, মাংস" : "Rice, Pulses, Vegetables, Fish, Meat",
          description: language === 'bn' ? "দৈনিক বাজারদরের হালনাগাদ তথ্য" : "Daily updated market price information"
        },
        {
          icon: Calendar,
          title: language === 'bn' ? "সাপ্তাহিক বাজার তথ্য" : "Weekly Market Information",
          description: language === 'bn' ? "সাপ্তাহিক হাট-বাজারের দিন ও সময়" : "Weekly market days and timings"
        }
      ]
    },
    {
      id: "projects",
      icon: HardHat,
      title: language === 'bn' ? "সরকারি প্রকল্প ও কাজ" : "Government Projects",
      color: "from-purple-500 to-violet-600",
      items: [
        {
          icon: Hammer,
          title: language === 'bn' ? "চলমান নির্মাণ কাজ" : "Ongoing Construction",
          description: language === 'bn' ? "রাস্তা/সেতু/স্কুল নির্মাণের তথ্য" : "Road/bridge/school construction information"
        },
        {
          icon: UserCheck,
          title: language === 'bn' ? "প্রকল্পের অগ্রগতি" : "Project Progress",
          description: language === 'bn' ? "প্রকল্পের অগ্রগতি ও দায়িত্বপ্রাপ্ত কর্মকর্তা" : "Project progress and responsible officer"
        }
      ]
    },
    {
      id: "admin",
      icon: UserCog,
      title: language === 'bn' ? "প্রশাসনিক তথ্য" : "Administrative Information",
      color: "from-indigo-500 to-blue-600",
      items: [
        {
          icon: Building,
          title: language === 'bn' ? "চেয়ারম্যান/ইউপি সদস্য/ইউএনও" : "Chairman/UP Member/UNO",
          description: language === 'bn' ? "স্থানীয় প্রশাসনিক কর্মকর্তাদের অফিস তথ্য" : "Local administrative officers' office information"
        },
        {
          icon: MessageSquare,
          title: language === 'bn' ? "অভিযোগ ও পরামর্শ" : "Complaints and Suggestions",
          description: language === 'bn' ? "অভিযোগ ও পরামর্শ জানানোর পদ্ধতি" : "Method for lodging complaints and suggestions"
        }
      ]
    },
    {
      id: "announcements",
      icon: Megaphone,
      title: language === 'bn' ? "ঘোষণা ও নোটিশ" : "Announcements",
      color: "from-red-500 to-pink-600",
      items: [
        {
          icon: Speaker,
          title: language === 'bn' ? "স্থানীয় অফিসের নোটিশ" : "Local Office Notices",
          description: language === 'bn' ? "স্থানীয় সরকারি অফিসের গুরুত্বপূর্ণ নোটিশ" : "Important notices from local government offices"
        },
        {
          icon: Clock,
          title: language === 'bn' ? "জরুরি সেবা তথ্য" : "Emergency Service Information",
          description: language === 'bn' ? "পানি/বিদ্যুৎ/গ্যাস বন্ধের সময়সূচী" : "Water/electricity/gas shutdown schedule"
        }
      ]
    },
    {
      id: "transport",
      icon: Bus,
      title: language === 'bn' ? "যাতায়াত ও পরিবহন" : "Transport",
      color: "from-teal-500 to-cyan-600",
      items: [
        {
          icon: Bus,
          title: language === 'bn' ? "বাস ও নৌকা সেবা" : "Bus and Boat Services",
          description: language === 'bn' ? "বাস ও নৌকার সময়সূচী ও ভাড়া" : "Bus and boat schedule and fares"
        },
        {
          icon: Route,
          title: language === 'bn' ? "নতুন রুট তথ্য" : "New Route Information",
          description: language === 'bn' ? "নতুন পরিবহন রুট ও যাতায়াত তথ্য" : "New transportation routes and travel information"
        }
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-emerald-900/10 dark:via-blue-900/10 dark:to-purple-900/10">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Building className="h-8 w-8 text-emerald-500 mr-3 animate-pulse" />
              <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400 tracking-wide">
                {language === 'bn' ? 'উপজেলা তথ্য' : 'Upazila Information'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              {language === 'bn' ? 'স্থানীয় সেবা ও তথ্য' : 'Local Services & Information'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              {language === 'bn' ? 'বাঞ্ছারামপুর উপজেলার সকল গুরুত্বপূর্ণ তথ্য ও সেবা এক জায়গায়' : 'All important information and services of Bancharampur Upazila in one place'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Category Tabs */}
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 h-auto p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/20 data-[state=active]:to-blue-500/20"
                  >
                    <IconComponent className="h-6 w-6 mb-2" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {category.title}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Category Content */}
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="animate-fade-in">
                  <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl overflow-hidden mb-8">
                    <CardHeader className={`bg-gradient-to-r ${category.color}/10 border-b border-emerald-100 dark:border-emerald-800/30`}>
                      <CardTitle className="flex items-center text-emerald-800 dark:text-emerald-400 text-2xl">
                        <div className={`p-3 bg-gradient-to-r ${category.color} rounded-lg mr-4`}>
                          <category.icon className="h-6 w-6 text-white" />
                        </div>
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        {category.items.map((item, index) => {
                          const ItemIcon = item.icon;
                          return (
                            <Card 
                              key={index} 
                              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-100/50 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50/80 to-blue-50/80 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                  <div className={`p-3 bg-gradient-to-r ${category.color} rounded-lg shrink-0`}>
                                    <ItemIcon className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {item.description}
                                    </p>
                                    <Badge variant="secondary" className="mt-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                      {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocalInfo;
