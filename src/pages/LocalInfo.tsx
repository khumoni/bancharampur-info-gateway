import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  GraduationCap, 
  Heart, 
  Bolt, 
  CloudSun, 
  HardHat, 
  UserCog, 
  Megaphone,
  Bus,
  Info,
  icons,
  Award, // Scholarship
  Gavel, // Legal Aid
  Leaf,  // Agriculture
  Landmark, // Housing
  Laptop, // Digital Services
  Theater, // Culture
  Stethoscope, // Private Health
  Siren, // Emergency News
  Briefcase, // Jobs
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useApp } from "@/contexts/AppContext";
import { useData, LocalInfoItem } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { LocationSelectorDialog } from "@/components/location/LocationSelectorDialog";
import { districts } from "@/lib/bd-locations";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

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
    case 'scholarship':
      return { title: item.title, description: `${lang === 'bn' ? 'প্রদানকারী' : 'Provider'}: ${item.provider} | ${lang === 'bn' ? 'যোগ্যতা' : 'Eligibility'}: ${item.eligibility} | ${lang === 'bn' ? 'শেষ তারিখ' : 'Deadline'}: ${item.deadline}` };
    case 'legal':
      return { title: item.serviceName, description: `${lang === 'bn' ? 'প্রদানকারী' : 'Provider'}: ${item.provider} | ${lang === 'bn' ? 'ঠিকানা' : 'Address'}: ${item.address} | ${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}: ${item.contact}` };
    case 'agriculture':
      return { title: item.serviceType, description: `${item.details} | ${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}: ${item.contact}` };
    case 'housing':
      return { title: item.projectName, description: `${item.details} | ${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}: ${item.contact}` };
    case 'digital_services':
      return { title: item.centerName, description: `${lang === 'bn' ? 'সেবা সমূহ' : 'Services'}: ${item.services} | ${lang === 'bn' ? 'ঠিকানা' : 'Address'}: ${item.address} | ${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}: ${item.contact}` };
    case 'culture':
      return { title: item.eventName, description: `${lang === 'bn' ? 'স্থান' : 'Location'}: ${item.location} | ${lang === 'bn' ? 'তারikh' : 'Date'}: ${item.date} | ${item.details}` };
    case 'private_health':
        const typeText = item.type === 'clinic' 
            ? (lang === 'bn' ? 'বেসরকারি ক্লিনিক' : 'Private Clinic') 
            : (lang === 'bn' ? 'ডায়াগনস্টিক সেন্টার' : 'Diagnostic Center');
        return { title: item.name, description: `${typeText} | ${lang === 'bn' ? 'বিশেষত্ব' : 'Specialty'}: ${item.specialty} | ${lang === 'bn' ? 'ঠিকানা' : 'Address'}: ${item.address} | ${lang === 'bn' ? 'যোগাযোগ' : 'Contact'}: ${item.contact}` };
    case 'emergency_news':
      return { title: item.title, description: `${item.details} (${item.date})` };
    case 'jobs':
      return { title: item.title, description: `${lang === 'bn' ? 'প্রতিষ্ঠান' : 'Company'}: ${item.company} | ${lang === 'bn' ? 'স্থান' : 'Location'}: ${item.location} | ${lang === 'bn' ? 'শেষ তারিখ' : 'Deadline'}: ${item.deadline}` };
    default:
      const exhaustiveCheck: never = item;
      return { title: 'Unknown Item', description: 'No details available.' };
  }
};

const LocalInfo = () => {
  const { language } = useApp();
  const { localInfoItems, loading, error } = useData();
  const { location } = useLocation();
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDistrict = useMemo(() => districts.find(d => d.name.en === location.district), [location.district]);
  const currentUpazila = useMemo(() => currentDistrict?.upazilas.find(u => u.name.en === location.upazila), [currentDistrict, location.upazila]);
  
  const locationName = language === 'bn'
    ? `${currentUpazila?.name.bn || location.upazila}, ${currentDistrict?.name.bn || location.district}`
    : `${location.upazila}, ${location.district}`;

  const categories = useMemo(() => [
    // Primary Services
    { id: 'education', label: language === 'bn' ? 'শিক্ষা' : 'Education', icon: GraduationCap },
    { id: 'health', label: language === 'bn' ? 'স্বাস্থ্য' : 'Health', icon: Heart },
    { id: 'agriculture', label: language === 'bn' ? 'কৃষি' : 'Agriculture', icon: Leaf },
    { id: 'private_health', label: language === 'bn' ? 'বেসরকারি স্বাস্থ্যসেবা' : 'Private Healthcare', icon: Stethoscope },
    // Support Services
    { id: 'scholarship', label: language === 'bn' ? 'বৃত্তি ও প্রশিক্ষণ' : 'Scholarships & Training', icon: Award },
    { id: 'legal', label: language === 'bn' ? 'আইনি সহায়তা' : 'Legal Aid', icon: Gavel },
    { id: 'jobs', label: language === 'bn' ? 'চাকরি' : 'Jobs', icon: Briefcase },
    // Administrative
    { id: 'admin', label: language === 'bn' ? 'প্রশাসন' : 'Admin', icon: UserCog },
    { id: 'digital_services', label: language === 'bn' ? 'ডিজিটাল সেবা' : 'Digital Services', icon: Laptop },
    { id: 'housing', label: language === 'bn' ? 'আবাসন ও জমি' : 'Housing & Land', icon: Landmark },
    // Infrastructure
    { id: 'transport', label: language === 'bn' ? 'যাতায়াত' : 'Transport', icon: Bus },
    { id: 'utilities', label: language === 'bn' ? 'सेवा' : 'Utilities', icon: Bolt },
    { id: 'projects', label: language === 'bn' ? 'প্রকল্প' : 'Projects', icon: HardHat },
    // Emergency & Info
    { id: 'weather', label: language === 'bn' ? 'আবহাওয়া' : 'Weather', icon: CloudSun },
    { id: 'announcements', label: language === 'bn' ? 'ঘোষণা' : 'Announcements', icon: Megaphone },
    { id: 'emergency_news', label: language === 'bn' ? 'জরুরি সংবাদ' : 'Emergency News', icon: Siren },
    // Social & Culture
    { id: 'culture', label: language === 'bn' ? 'সংস্কৃতি ও বিনোদন' : 'Culture & Entertainment', icon: Theater },
  ], [language]);

  const renderIcon = (name: string) => {
    const Icon = icons[name as keyof typeof icons] || Info;
    return <Icon className="h-5 w-5 mr-3 text-gray-600" />;
  };

  // Refresh function: simple reload for demo (would refetch in real app)
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

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
            <div className="flex flex-col items-center gap-2 mt-4">
              <Button onClick={() => setIsLocationSelectorOpen(true)}>
                {language === 'bn' ? 'এলাকা পরিবর্তন করুন' : 'Change Location'}
              </Button>
              <Button variant="outline" size="sm" className="mt-1 flex items-center gap-2" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={refreshing ? "animate-spin" : ""} size={16} />
                {refreshing
                  ? (language === 'bn' ? "রিফ্রেশ হচ্ছে..." : "Refreshing...")
                  : (language === 'bn' ? "তথ্য রিফ্রেশ করুন" : "Refresh Data")}
              </Button>
            </div>
            {error && (
              <div className="text-red-500 mt-3">{error}</div>
            )}
          </CardContent>
        </Card>
        
        {/* LOADING & ERROR STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skeletons">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton className="h-56 w-full rounded-xl mb-3" />
                <Skeleton className="h-4 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const itemsForCategory = localInfoItems.filter(item => 
                item.district === location.district && 
                item.upazila === location.upazila &&
                item.categoryId === cat.id
              );

              return (
                <Accordion type="single" collapsible key={cat.id} className="w-full bg-card rounded-lg border shadow-sm transition-all hover:shadow-md">
                  <AccordionItem value={cat.id} className="border-b-0">
                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                      <div className="flex items-center w-full">
                        <cat.icon className="w-8 h-8 mr-4 text-primary shrink-0" />
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold">{cat.label}</h3>
                        </div>
                        <Badge variant="secondary" className="ml-4 shrink-0">{itemsForCategory.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                      <div className="space-y-4">
                        {itemsForCategory.length > 0 ? (
                          itemsForCategory.map(item => {
                            const { title, description } = getItemContent(item, language);
                            return (
                              <div key={item.id} className="flex items-start p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                {renderIcon(item.icon)}
                                <div>
                                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            {language === 'bn' ? 'এই এলাকার জন্য কোনো তথ্য পাওয়া যায়নি।' : 'No information found for this area.'}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <LocationSelectorDialog isOpen={isLocationSelectorOpen} onOpenChange={setIsLocationSelectorOpen} />
    </div>
  );
};

export default LocalInfo;
