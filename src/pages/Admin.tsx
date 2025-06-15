
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { Shield, BarChart, AlertTriangle, FileText, FolderCog, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EducationManager } from "@/components/admin/EducationManager";
import { HealthManager } from "@/components/admin/HealthManager";
import { UtilitiesManager } from "@/components/admin/UtilitiesManager";
import { WeatherManager } from "@/components/admin/WeatherManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { AdministrativeInfoManager } from "@/components/admin/AdministrativeInfoManager";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { TransportManager } from "@/components/admin/TransportManager";
import { ScholarshipManager } from "@/components/admin/ScholarshipManager";
import { LegalAidManager } from "@/components/admin/LegalAidManager";
import { AgricultureManager } from "@/components/admin/AgricultureManager";
import { HousingManager } from "@/components/admin/HousingManager";
import { DigitalServiceManager } from "@/components/admin/DigitalServiceManager";
import { CultureInfoManager } from "@/components/admin/CultureInfoManager";
import { PrivateHealthManager } from "@/components/admin/PrivateHealthManager";
import { EmergencyNewsManager } from "@/components/admin/EmergencyNewsManager";
import { JobManager } from "@/components/admin/JobManager";
import { Header } from "@/components/layout/Header";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LocalInfoAdminPanel } from "@/components/admin/LocalInfoAdminPanel";
import { PostManagementPanel } from "@/components/admin/PostManagementPanel";
import { NoticesPanel } from "@/components/admin/NoticesPanel";
import { MarketRatePanel } from "@/components/admin/MarketRatePanel";
import { LocalAdminPanel } from "@/components/admin/LocalAdminPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Users, Info, GraduationCap, Heart, Bolt, CloudSun, HardHat, Megaphone, Bus, Award, Gavel, Leaf, Landmark, Laptop, Theater, Stethoscope, Siren, Briefcase, ArrowLeft } from "lucide-react";

const localInfoCategories = [
  { id: "education", label: "শিক্ষা", manager: EducationManager },
  { id: "health", label: "স্বাস্থ্য", manager: HealthManager },
  { id: "utilities", label: "বিদ্যুৎ ও গ্যাস", manager: UtilitiesManager },
  { id: "weather", label: "আবহাওয়া", manager: WeatherManager },
  { id: "projects", label: "সরকারি প্রকল্প", manager: ProjectsManager },
  { id: "admin-info", label: "প্রশাসনিক তথ্য", manager: AdministrativeInfoManager },
  { id: "announcements", label: "ঘোষণা", manager: AnnouncementsManager },
  { id: "transport", label: "যাতায়াত", manager: TransportManager },
  { id: "scholarship", label: "বৃত্তি ও প্রশিক্ষণ", manager: ScholarshipManager },
  { id: "legal-aid", label: "আইনি সহায়তা", manager: LegalAidManager },
  { id: "agriculture", label: "কৃষি", manager: AgricultureManager },
  { id: "housing", label: "আবাসন", manager: HousingManager },
  { id: "digital-services", label: "ডিজিটাল সেবা", manager: DigitalServiceManager },
  { id: "culture", label: "সংস্কৃতি", manager: CultureInfoManager },
  { id: "private-health", label: "বেসরকারি স্বাস্থ্য", manager: PrivateHealthManager },
  { id: "emergency-news", label: "জরুরি সংবাদ", manager: EmergencyNewsManager },
  { id: "jobs", label: "চাকরি", manager: JobManager },
];

const mainTabs = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart },
  { id: "local-info", label: "স্থানীয় তথ্য ব্যবস্থাপনা", icon: FolderCog },
  { id: "post-management", label: "পোস্ট ও ইউজার", icon: Shield },
  { id: "notices", label: "বিজ্ঞপ্তি ও জরুরি", icon: AlertTriangle },
  { id: "market", label: "বাজার দর", icon: FileText },
  { id: "local-admin", label: "লোকাল অ্যাডমিন", icon: UserCog }, 
];

const Admin = () => {
  const { user, register } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [localInfoTab, setLocalInfoTab] = useState<string | null>(null);
  const [localAdminForm, setLocalAdminForm] = useState({
    email: '',
    name: '',
    phone: '',
    district: '',
    upazila: ''
  });
  const [isAddingLocalAdmin, setIsAddingLocalAdmin] = useState(false);
  const [localAdmins, setLocalAdmins] = useState<any[]>([]);
  const { user: authUser } = useAuth();
  const { notices, addNotice } = useData();
  const { language } = useApp();
  const { toast } = useToast();
  const [noticeForm, setNoticeForm] = useState({
    type: 'emergency' as 'electricity' | 'weather' | 'gas' | 'emergency',
    title: '',
    message: '',
    severity: 'medium' as 'high' | 'medium' | 'low'
  });

  if (!authUser || authUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <div className="p-6 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">অ্যাক্সেস নিষেধ</h2>
            <p className="text-gray-600">আপনার এই পৃষ্ঠায় প্রবেশের অনুমতি নেই।</p>
          </div>
        </Card>
      </div>
    );
  }

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.message) return;

    addNotice(noticeForm);
    setNoticeForm({
      type: 'emergency',
      title: '',
      message: '',
      severity: 'medium'
    });
    
    toast({
      title: "সফল!",
      description: "নতুন বিজ্ঞপ্তি প্রকাশ করা হয়েছে",
    });
  };

  React.useEffect(() => {
    if (activeTab === "local-admin") {
      (async () => {
        import('firebase/firestore').then(({ collection, getDocs, query, where }) => {
          const { db } = require('@/lib/firebase');
          const q = query(collection(db, 'users'), where('role', '==', 'localAdmin'));
          getDocs(q).then((snapshot: any) => {
            const list: any[] = [];
            snapshot.forEach((doc: any) => list.push({ id: doc.id, ...doc.data() }));
            setLocalAdmins(list);
          });
        });
      })();
    }
  }, [activeTab]);

  const handleLocalAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingLocalAdmin(true);
    const { email, name, phone, district, upazila } = localAdminForm;
    if (!email || !name || !district || !upazila) {
      toast({
        title: "সব তথ্য দিন",
        description: "ইমেইল, নাম, জেলা ও উপজেলা বাধ্যতামূলক",
        variant: "destructive"
      });
      setIsAddingLocalAdmin(false);
      return;
    }
    const success = await register(
      email,
      phone || Math.random().toString(36).substring(2, 10),
      name,
      phone,
      'localAdmin',
      [{ district, upazila }]
    );
    if (success) {
      toast({ title: "সফল", description: "নতুন local admin তৈরি হয়েছে" });
      setLocalAdminForm({ email: '', name: '', phone: '', district: '', upazila: '' });
      setActiveTab("dashboard");
      setTimeout(() => setActiveTab("local-admin"), 200); 
    } else {
      toast({ title: "ব্যর্থ", description: "লোড করতে ব্যর্থ", variant: "destructive" });
    }
    setIsAddingLocalAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-4 px-2">
        {!localInfoTab ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8 mt-2">
              {mainTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center border rounded-lg py-6 px-2 shadow-sm bg-white hover:bg-green-50 transition-all ${activeTab === tab.id ? "border-green-500 shadow-md" : ""}`}
                  aria-current={activeTab === tab.id}
                >
                  <tab.icon className="w-7 h-7 mb-2 text-green-700" />
                  <span className="font-semibold text-sm md:text-base text-gray-700">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2">
            <button type="button" onClick={() => setLocalInfoTab(null)} className="hover:bg-accent p-2 rounded-md">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold">স্থানীয় তথ্য ব্যবস্থাপনা</span>
          </div>
        )}
        <div className="mt-5">
          {activeTab === "dashboard" && (
            <AdminDashboard
              totalUsers={1234}
              todaysPosts={45}
              emergencyNotices={notices.length}
              pendingPosts={12}
            />
          )}
          {activeTab === "local-info" && (
            <LocalInfoAdminPanel
              localInfoCategories={localInfoCategories}
              localInfoTab={localInfoTab}
              setLocalInfoTab={setLocalInfoTab}
            />
          )}
          {activeTab === "post-management" && <PostManagementPanel />}
          {activeTab === "notices" && (
            <NoticesPanel
              noticeForm={noticeForm}
              setNoticeForm={setNoticeForm}
              handleNoticeSubmit={handleNoticeSubmit}
            />
          )}
          {activeTab === "market" && <MarketRatePanel />}
          {activeTab === "local-admin" && (
            <LocalAdminPanel
              localAdminForm={localAdminForm}
              setLocalAdminForm={setLocalAdminForm}
              isAddingLocalAdmin={isAddingLocalAdmin}
              handleLocalAdminSubmit={handleLocalAdminSubmit}
              localAdmins={localAdmins}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
