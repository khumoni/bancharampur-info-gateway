import { useState, useMemo } from "react";
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

  const categories = useMemo(() => [
    { id: 'education', label: language === 'bn' ? 'শিক্ষা' : 'Education', icon: GraduationCap },
    { id: 'health', label: language === 'bn' ? 'স্বাস্থ্য' : 'Health', icon: Heart },
    { id: 'transport', label: language === 'bn' ? 'যাতায়াত' : 'Transport', icon: Bus },
    { id: 'admin', label: language === 'bn' ? 'প্রশাসন' : 'Admin', icon: UserCog },
    { id: 'utilities', label: language === 'bn' ? 'सेवा' : 'Utilities', icon: Bolt },
    { id: 'weather', label: language === 'bn' ? 'আবহাওয়া' : 'Weather', icon: CloudSun },
    { id: 'projects', label: language === 'bn' ? 'প্রকল্প' : 'Projects', icon: HardHat },
    { id: 'announcements', label: language === 'bn' ? 'ঘোষণা' : 'Announcements', icon: Megaphone },
  ], [language]);

  const filteredItems = useMemo(() => localInfoItems.filter(item => 
    item.district === location.district && 
    item.upazila === location.upazila &&
    item.categoryId === activeTab
  ), [localInfoItems, location, activeTab]);

  const renderIcon = (name: string) => {
    const Icon = icons[name as keyof typeof icons] || Info;
    return <Icon className="h-5 w-5 mr-3 text-gray-600" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mb-8 bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {language === 'bn' ? `${locationName}-এর স্থানীয় তথ্য` : `Local Information for ${locationName}`}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {language === 'bn' ? 'আপনার প্রয়োজনীয় সকল তথ্য এখানে পাবেন।' : 'Find all the necessary information here.'}
            </p>
            <Button onClick={() => setIsLocationSelectorOpen(true)} className="mt-4">
              {language === 'bn' ? 'এলাকা পরিবর্তন করুন' : 'Change Location'}
            </Button>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id}>
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{cat.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => {
                      const { title, description } = getItemContent(item, language);
                      return (
                        <div key={item.id} className="flex items-start p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                          {renderIcon(item.icon)}
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      {language === 'bn' ? 'এই এলাকার জন্য কোনো তথ্য পাওয়া যায়নি।' : 'No information found for this area.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
      <LocationSelectorDialog isOpen={isLocationSelectorOpen} onOpenChange={setIsLocationSelectorOpen} />
    </div>
  );
};

export default LocalInfo;
