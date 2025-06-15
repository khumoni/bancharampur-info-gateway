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
  Route,
  Info,
  icons
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/contexts/AppContext";
import { useData, LocalInfoItem } from "@/contexts/DataContext";
import { MarketRates } from "@/components/home/MarketRates";
import { useLocation } from "@/contexts/LocationContext";
import { LocationSelectorDialog } from "@/components/location/LocationSelectorDialog";
import { districts } from "@/lib/bd-locations";

const getItemContent = (item: LocalInfoItem, lang: 'bn' | 'en') => {
  const typeTranslations = {
    school: lang === 'bn' ? 'স্কুল' : 'School',
    college: lang === 'bn' ? 'কলেজ' : 'College',
    university: lang === 'bn' ? 'বিশ্ববিদ্যালয়' : 'University',
    madrasha: lang === 'bn' ? 'মাদ্রাসা' : 'Madrasha',
    hospital: lang === 'bn' ? 'হাসপাতাল' : 'Hospital',
    clinic: lang === 'bn' ? 'ক্লিনিক' : 'Clinic',
    diagnostic: lang === 'bn' ? 'ডায়াগনস্টিক' : 'Diagnostic',
    pharmacy: lang === 'bn' ? 'ফার্মেসি' : 'Pharmacy',
    bus: lang === 'bn' ? 'বাস' : 'Bus',
    train: lang === 'bn' ? 'ট্রেন' : 'Train',
    'auto-rickshaw': lang === 'bn' ? 'অটো-রিকশা' : 'Auto Rickshaw',
    electricity: lang === 'bn' ? 'বিদ্যুৎ' : 'Electricity',
    gas: lang === 'bn' ? 'গ্যাস' : 'Gas',
    water: lang === 'bn' ? 'পানি' : 'Water',
    ongoing: lang === 'bn' ? 'চলমান' : 'Ongoing',
    completed: lang === 'bn' ? 'সম্পন্ন' : 'Completed',
    planned: lang === 'bn' ? 'পরিকল্পনাধীন' : 'Planned',
  };

  switch (item.categoryId) {
    case 'education':
      return { title: item.institutionName, description: `${typeTranslations[item.type]} | ${item.address} | ${item.contact}` };
    case 'health':
      return { title: item.name, description: `${typeTranslations[item.type]} | ${item.address} | ${item.phone}` };
    case 'transport':
      return { title: item.routeName, description: `${lang === 'bn' ? 'ধরন' : 'Type'}: ${typeTranslations[item.type]}, ${lang === 'bn' ? 'ভাড়া' : 'Fare'}: ${item.fare}, ${lang === 'bn' ? 'সময়সূচী' : 'Schedule'}: ${item.schedule}` };
    case 'admin':
      return { title: item.officeName, description: `${item.officerName} (${item.designation}) | ${item.contact}` };
    case 'utilities':
      return { title: `${typeTranslations[item.serviceType]} ${lang === 'bn' ? 'অফিস' : 'Office'}`, description: `${lang === 'bn' ? 'ঠিকানা' : 'Address'}: ${item.officeAddress}, ${lang === 'bn' ? 'অভিযোগ' : 'Complaint'}: ${item.complaintNumber}` };
    case 'weather':
      return { title: item.area, description: `${lang === 'bn' ? 'তাপমাত্রা' : 'Temp'}: ${item.temperature}, ${lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}: ${item.humidity}. ${lang === 'bn' ? 'সতর্কবার্তা' : 'Alert'}: ${item.alert || (lang === 'bn' ? 'নেই' : 'None')}` };
    case 'projects':
      return { title: item.projectName, description: `${lang === 'bn' ? 'সংস্থা' : 'Agency'}: ${item.implementingAgency}, ${lang === 'bn' ? 'বাজেট' : 'Budget'}: ${item.budget}, ${lang === 'bn' ? 'অবস্থা' : 'Status'}: ${typeTranslations[item.status]}` };
    case 'announcements':
      return { title: item.title, description: `${item.details} (${item.date})` };
    default:
      const exhaustiveCheck: never = item;
      return { title: 'Unknown Item', description: 'No details available.' };
  }
};

const LocalInfo = () => {
  const { language } = useApp();
  const { localInfoItems } = useData();
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState("education");
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);

  const currentDistrict = useMemo(() => districts.find(d => d.name.en === location.district), [location.district]);
  const currentUpazila = useMemo(() => currentDistrict?.upazilas.find(u => u.name.en === location.upazila), [currentDistrict, location.upazila]);

  const locationName = language === 'bn'
    ? `${currentUpazila?.name.bn || location.upazila}, ${currentDistrict?.name.bn || location.district}`
    : `${location.upazila}, ${location.district}`;

  const upazilaName = language === 'bn' ? currentUpazila?.name.bn || location.upazila : location.upazila;

  const filteredLocalInfoItems = useMemo(() => localInfoItems.filter(item =>
    item.district === location.district && item.upazila === location.upazila
  ), [localInfoItems, location]);

  const categories = [
    {
      id: "education",
      icon: GraduationCap,
      title: language === 'bn' ? "শিক্ষা" : "Education",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "health",
      icon: Heart,
      title: language === 'bn' ? "স্বাস্থ্য" : "Health",
      color: "from-red-500 to-pink-600",
    },
    {
      id: "utilities",
      icon: Bolt,
      title: language === 'bn' ? "বিদ্যুৎ ও গ্যাস" : "Electricity and Gas",
      color: "from-yellow-500 to-orange-600",
    },
    {
      id: "weather",
      icon: CloudSun,
      title: language === 'bn' ? "আবহাওয়া ও দুর্যোগ" : "Weather and Disasters",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "market",
      icon: ShoppingCart,
      title: language === 'bn' ? "স্থানীয় বাজারদর" : "Local Market Prices",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "projects",
      icon: HardHat,
      title: language === 'bn' ? "সরকারি প্রকল্প ও কাজ" : "Government Projects",
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "admin",
      icon: UserCog,
      title: language === 'bn' ? "প্রশাসনিক তথ্য" : "Administrative Information",
      color: "from-indigo-500 to-blue-600",
    },
    {
      id: "announcements",
      icon: Megaphone,
      title: language === 'bn' ? "ঘোষণা ও নোটিশ" : "Announcements",
      color: "from-red-500 to-pink-600",
    },
    {
      id: "transport",
      icon: Bus,
      title: language === 'bn' ? "যাতায়াত ও পরিবহন" : "Transport",
      color: "from-teal-500 to-cyan-600",
    }
  ];

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
                {locationName}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              {language === 'bn' ? 'স্থানীয় সেবা ও তথ্য' : 'Local Services & Information'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              {language === 'bn' ? `${upazilaName} উপজেলার সকল গুরুত্বপূর্ণ তথ্য ও সেবা এক জায়গায়` : `All important information and services of ${upazilaName} Upazila in one place`}
            </p>
            <Button onClick={() => setIsLocationSelectorOpen(true)} variant="outline" className="bg-white/50 backdrop-blur-sm">
                {language === 'bn' ? 'এলাকা পরিবর্তন করুন' : 'Change Location'}
            </Button>
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
            {categories.map((category) => {
              const itemsForCategory = filteredLocalInfoItems.filter(item => item.categoryId === category.id);
              return (
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
                      {category.id === 'market' ? (
                        <MarketRates />
                      ) : itemsForCategory.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {itemsForCategory.map((item) => {
                            const ItemIcon = icons[item.icon as keyof typeof icons] || AlertTriangle;
                            const { title, description } = getItemContent(item, language);
                            return (
                              <Card 
                                key={item.id} 
                                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-emerald-100/50 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50/80 to-blue-50/80 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start space-x-4">
                                    <div className={`p-3 bg-gradient-to-r ${category.color} rounded-lg shrink-0`}>
                                      <ItemIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        {title}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {description}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-xl font-semibold">{language === 'bn' ? 'কোনো তথ্য পাওয়া যায়নি' : 'No Information Found'}</h3>
                          <p className="mt-2">{language === 'bn' ? `এই এলাকায় '${category.title}' ক্যাটেগরিতে কোনো তথ্য যোগ করা হয়নি।` : `No information has been added in the '${category.title}' category for this area yet.`}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )})}
          </Tabs>
        </div>
      </section>

      <LocationSelectorDialog 
        isOpen={isLocationSelectorOpen} 
        onOpenChange={setIsLocationSelectorOpen}
      />

      <Footer />
    </div>
  );
};

export default LocalInfo;
