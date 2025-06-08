
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/layout/Header";
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Users, FileText, AlertTriangle, BarChart } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const adminTabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart },
    { id: "notices", label: "বিজ্ঞপ্তি", icon: AlertTriangle },
    { id: "content", label: "কন্টেন্ট", icon: FileText },
    { id: "users", label: "ব্যবহারকারী", icon: Users },
  ];

  const stats = [
    { label: "মোট ব্যবহারকারী", value: "১,২৩৪", color: "bg-blue-500" },
    { label: "আজকের পোস্ট", value: "৪৫", color: "bg-green-500" },
    { label: "জরুরি বিজ্ঞপ্তি", value: "৩", color: "bg-red-500" },
    { label: "অপেক্ষমাণ পোস্ট", value: "১২", color: "bg-yellow-500" },
  ];

  const pendingPosts = [
    { id: 1, author: "মোহাম্মদ আলী", content: "নতুন দোকান খোলা হয়েছে...", time: "২ মিনিট আগে", status: "pending" },
    { id: 2, author: "রহিমা খাতুন", content: "রাস্তার অবস্থা খুবই খারাপ...", time: "১৫ মিনিট আগে", status: "pending" },
    { id: 3, author: "করিম উদ্দিন", content: "ডাক্তারের খোঁজ দরকার...", time: "৩০ মিনিট আগে", status: "pending" },
  ];

  const recentNotices = [
    { id: 1, title: "বিদ্যুৎ বিভ্রাট", type: "electricity", date: "আজ", status: "active" },
    { id: 2, title: "আবহাওয়া সতর্কতা", type: "weather", date: "গতকাল", status: "active" },
    { id: 3, title: "গ্যাস সরবরাহ", type: "gas", date: "২ দিন আগে", status: "expired" },
  ];

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

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>অপেক্ষমাণ পোস্ট</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{post.author}</p>
                            <p className="text-sm text-gray-600 truncate">{post.content}</p>
                            <p className="text-xs text-gray-500">{post.time}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>সাম্প্রতিক বিজ্ঞপ্তি</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentNotices.map((notice) => (
                        <div key={notice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{notice.title}</p>
                            <p className="text-sm text-gray-600">{notice.date}</p>
                          </div>
                          <Badge variant={notice.status === "active" ? "default" : "secondary"}>
                            {notice.status === "active" ? "সক্রিয়" : "মেয়াদ শেষ"}
                          </Badge>
                        </div>
                      ))}
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
                <Button className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  নতুন বিজ্ঞপ্তি
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>নতুন জরুরি বিজ্ঞপ্তি যোগ করুন</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">বিজ্ঞপ্তির ধরন</label>
                      <Select>
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
                      <Select>
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
                    <Input placeholder="বিজ্ঞপ্তির শিরোনাম লিখুন" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত</label>
                    <Textarea placeholder="বিস্তারিত তথ্য লিখুন" className="min-h-[100px]" />
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    জরুরি বিজ্ঞপ্তি প্রকাশ করুন
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">কন্টেন্ট ম্যানেজমেন্ট</h1>
              
              <Card>
                <CardHeader>
                  <CardTitle>পোস্ট মডারেশন</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>লেখক</TableHead>
                        <TableHead>কন্টেন্ট</TableHead>
                        <TableHead>সময়</TableHead>
                        <TableHead>অবস্থা</TableHead>
                        <TableHead>কার্যক্রম</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.author}</TableCell>
                          <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                          <TableCell>{post.time}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">অপেক্ষমাণ</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-green-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

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
