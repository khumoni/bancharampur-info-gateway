import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { Shield, BarChart, AlertTriangle, FileText, FolderCog, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Local Info Managers
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
import { PostManager } from "@/components/admin/PostManager";
import { MarketRateManager } from "@/components/admin/MarketRateManager";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Users, Info, GraduationCap, Heart, Bolt, CloudSun, HardHat, UserCog, Megaphone, Bus, Award, Gavel, Leaf, Landmark, Laptop, Theater, Stethoscope, Siren, Briefcase } from "lucide-react";

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
  { id: "local-admin", label: "লোকাল অ্যাডমিন", icon: UserCog }, // নতুন ট্যাব
];

const Admin = () => {
  // Destructure 'register' from 'useAuth' (previously only 'user' was destructured)
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

  // Sidebar collapsed, now using a card-grid nav for main categories
  if (!authUser || authUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">অ্যাক্সেস নিষেধ</h2>
            <p className="text-gray-600">আপনার এই পৃষ্ঠায় প্রবেশের অনুমতি নেই।</p>
          </CardContent>
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
        // Firestore থেকে localAdmin ইউজার আনা (সরলতা ও ডেমোর জন্য, মূল ডেটা ঠিকভাবে কাস্টম কোয়েরি প্রয়োগ করলে আরও ভালো)
        // এখানে just db.collection ব্যবহার ধরে example...
        import('firebase/firestore').then(({ collection, getDocs, query, where }) => {
          const { db } = require('@/lib/firebase');
          const q = query(collection(db, 'users'), where('role', '==', 'localAdmin'));
          getDocs(q).then(snapshot => {
            const list: any[] = [];
            snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            setLocalAdmins(list);
          });
        });
      })();
    }
  }, [activeTab]);

  const handleLocalAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingLocalAdmin(true);
    // Register the user as localAdmin
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
      phone || Math.random().toString(36).substring(2, 10), // ডেমোর জন্য random pass
      name,
      phone,
      'localAdmin',
      [{ district, upazila }]
    );
    if (success) {
      toast({ title: "সফল", description: "নতুন local admin তৈরি হয়েছে" });
      setLocalAdminForm({ email: '', name: '', phone: '', district: '', upazila: '' });
      setActiveTab("dashboard");
      setTimeout(() => setActiveTab("local-admin"), 200); // Refresh
    } else {
      toast({ title: "ব্যর্থ", description: "লোড করতে ব্যর্থ", variant: "destructive" });
    }
    setIsAddingLocalAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Navigation */}
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
            <Button variant="ghost" onClick={() => setLocalInfoTab(null)} size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-bold">স্থানীয় তথ্য ব্যবস্থাপনা</span>
          </div>
        )}

        {/* Main Content based on selected tab */}
        <div className="mt-5">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
              <div className="flex flex-wrap gap-6">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-blue-700">১,২৩৪</span>
                    <span className="text-gray-500 text-sm">মোট ব্যবহারকারী</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-green-700">৪৫</span>
                    <span className="text-gray-500 text-sm">আজকের পোস্ট</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-red-700">{notices.length}</span>
                    <span className="text-gray-500 text-sm">জরুরি বিজ্ঞপ্তি</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <span className="text-3xl font-bold text-yellow-600">১২</span>
                    <span className="text-gray-500 text-sm">অপেক্ষমাণ পোস্ট</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "local-info" && !localInfoTab && (
            <div>
              <h2 className="text-xl font-bold mb-4">স্থানীয় তথ্যের ক্যাটেগরি নির্বাচন করুন</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {localInfoCategories.map(cat => (
                  <button
                    key={cat.id}
                    className="flex flex-col p-5 items-center border rounded-lg shadow-sm bg-white hover:bg-green-50 active:scale-95 transition-all"
                    onClick={() => setLocalInfoTab(cat.id)}
                  >
                    <span className="text-green-700 text-2xl mb-1">📂</span>
                    <span className="font-medium text-gray-700">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "local-info" && localInfoTab && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => setLocalInfoTab(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                ক্যাটেগরি নির্বাচন পাতায় ফিরুন
              </Button>
              <div className="mt-4">
                {
                  (() => {
                    const selectedCat = localInfoCategories.find(cat => cat.id === localInfoTab);
                    if (!selectedCat) return <div>ক্যাটেগরি খুঁজে পাওয়া যায়নি।</div>;
                    const ManagerComp = selectedCat.manager;
                    return <ManagerComp />;
                  })()
                }
              </div>
            </div>
          )}

          {activeTab === "post-management" && (
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-3">পোস্ট ও ইউজার ব্যবস্থাপনা</h1>
              <PostManager />
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>ব্যবহারকারী ব্যবস্থাপনা (শীঘ্রই আসছে...)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="py-4 text-center text-gray-500">
                      ব্যবহারকারী ব্যবস্থাপনা ফিচার শীঘ্রই আসছে...
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">বিজ্ঞপ্তি ব্যবস্থাপনা</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>নতুন জরুরি বিজ্ঞপ্তি যোগ করুন</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNoticeSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">বিজ্ঞপ্তির ধরন</label>
                        <Select value={noticeForm.type} onValueChange={(value: any) => setNoticeForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="ধরন নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electricity">বিদ্যুৎ</SelectItem>
                            <SelectItem value="gas">গ্যাস</SelectItem>
                            <SelectItem value="weather">আবহাওয়া</SelectItem>
                            <SelectItem value="emergency">জরুরি</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">গুরুত্ব</label>
                        <Select value={noticeForm.severity} onValueChange={(value: any) => setNoticeForm(prev => ({ ...prev, severity: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="গুরুত্ব নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">উচ্চ</SelectItem>
                            <SelectItem value="medium">মাঝারি</SelectItem>
                            <SelectItem value="low">কম</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম</label>
                      <Input 
                        placeholder="বিজ্ঞপ্তির শিরোনাম লিখুন" 
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত</label>
                      <Textarea 
                        placeholder="বিস্তারিত তথ্য লিখুন" 
                        className="min-h-[100px]"
                        value={noticeForm.message}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      জরুরি বিজ্ঞপ্তি প্রকাশ করুন
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "market" && (
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-3">বাজারদর ব্যবস্থাপনা</h1>
              <MarketRateManager />
            </div>
          )}

          {activeTab === "local-admin" && (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-800">লোকাল অ্যাডমিন ব্যবস্থাপনা</h1>
              <form onSubmit={handleLocalAdminSubmit} className="p-4 bg-white mb-8 rounded-lg shadow space-y-3 max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">ইমেইল <span className="text-red-500">*</span></label>
                    <Input required value={localAdminForm.email} onChange={e => setLocalAdminForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">নাম <span className="text-red-500">*</span></label>
                    <Input required value={localAdminForm.name} onChange={e => setLocalAdminForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">মোবাইল</label>
                    <Input value={localAdminForm.phone} onChange={e => setLocalAdminForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">জেলা <span className="text-red-500">*</span></label>
                    <Input required value={localAdminForm.district} onChange={e => setLocalAdminForm(f => ({ ...f, district: e.target.value }))} placeholder="District" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">উপজেলা <span className="text-red-500">*</span></label>
                    <Input required value={localAdminForm.upazila} onChange={e => setLocalAdminForm(f => ({ ...f, upazila: e.target.value }))} placeholder="Upazila" />
                  </div>
                </div>
                <Button type="submit" className="bg-green-600 text-white" disabled={isAddingLocalAdmin}>
                  {isAddingLocalAdmin ? "রেজিস্টার হচ্ছে..." : "নতুন Local Admin যোগ করুন"}
                </Button>
              </form>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4 text-lg">বর্তমান Local Admins</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">নাম</th>
                        <th className="p-2 text-left">ইমেইল</th>
                        <th className="p-2 text-left">জেলা</th>
                        <th className="p-2 text-left">উপজেলা</th>
                        <th className="p-2 text-left">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localAdmins.map((x, i) => (
                        <tr key={x.id || i} className="border-b">
                          <td className="p-2">{x.name}</td>
                          <td className="p-2">{x.email}</td>
                          <td className="p-2">{x.assignedLocations?.[0]?.district || '—'}</td>
                          <td className="p-2">{x.assignedLocations?.[0]?.upazila || '—'}</td>
                          <td className="p-2">{x.phone}</td>
                        </tr>
                      ))}
                      {localAdmins.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">কোনো Local Admin পাওয়া যায়নি</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
