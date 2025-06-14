import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { MarketRateManager } from "@/components/admin/MarketRateManager";
import { LocalInfoManager } from "@/components/admin/LocalInfoManager";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { PlusCircle, BarChart, AlertTriangle, FileText, Users, Shield, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [noticeForm, setNoticeForm] = useState({
    type: 'emergency' as 'electricity' | 'weather' | 'gas' | 'emergency',
    title: '',
    message: '',
    severity: 'medium' as 'high' | 'medium' | 'low'
  });
  
  const { user } = useAuth();
  const { notices, addNotice } = useData();
  const { language } = useApp();
  const { toast } = useToast();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
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

  const adminTabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart },
    { id: "notices", label: "বিজ্ঞপ্তি", icon: AlertTriangle },
    { id: "market", label: "বাজার দর", icon: FileText },
    { id: "local-info", label: "স্থানীয় তথ্য", icon: Info },
    { id: "users", label: "ব্যবহারকারী", icon: Users },
  ];

  const stats = [
    { label: "মোট ব্যবহারকারী", value: "১,২৩৪", color: "bg-blue-500" },
    { label: "আজকের পোস্ট", value: "৪৫", color: "bg-green-500" },
    { label: "জরুরি বিজ্ঞপ্তি", value: notices.length.toString(), color: "bg-red-500" },
    { label: "অপেক্ষমাণ পোস্ট", value: "১২", color: "bg-yellow-500" },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">অ্যাডমিন প্যানেল</h2>
            <nav className="space-y-2">
              {adminTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? "bg-green-100 text-green-800 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg`}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Notices */}
              <Card>
                <CardHeader>
                  <CardTitle>সাম্প্রতিক বিজ্ঞপ্তি</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notices.slice(0, 3).map((notice) => (
                      <div key={notice.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{notice.title}</p>
                          <p className="text-sm text-gray-600 truncate">{notice.message}</p>
                        </div>
                        <Badge variant={notice.severity === "high" ? "destructive" : "default"}>
                          {notice.severity === "high" ? "জরুরি" : "গুরুত্বপূর্ণ"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

          {activeTab === "market" && <MarketRateManager />}

          {activeTab === "local-info" && <LocalInfoManager />}

          {activeTab === "users" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">ব্যবহারকারী ব্যবস্থাপনা</h1>
              
              <Card>
                <CardHeader>
                  <CardTitle>সদস্য তালিকা</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    ব্যবহারকারী ব্যবস্থাপনা ফিচার শীঘ্রই আসছে...
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
