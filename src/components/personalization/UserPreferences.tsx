import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  BookOpen, 
  Video, 
  MessageSquare,
  TrendingUp,
  MapPin,
  Bell,
  Eye,
  Filter
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserPreference {
  category: string;
  label: string;
  icon: any;
  isEnabled: boolean;
  priority: number;
}

interface NotificationSetting {
  type: string;
  label: string;
  enabled: boolean;
}

export const UserPreferences = () => {
  const { language } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<UserPreference[]>([
    {
      category: 'education',
      label: language === 'bn' ? 'শিক্ষা' : 'Education',
      icon: BookOpen,
      isEnabled: true,
      priority: 80
    },
    {
      category: 'health',
      label: language === 'bn' ? 'স্বাস্থ্য' : 'Health',
      icon: Heart,
      isEnabled: true,
      priority: 90
    },
    {
      category: 'transport',
      label: language === 'bn' ? 'পরিবহন' : 'Transportation',
      icon: MapPin,
      isEnabled: false,
      priority: 60
    },
    {
      category: 'agriculture',
      label: language === 'bn' ? 'কৃষি' : 'Agriculture',
      icon: TrendingUp,
      isEnabled: true,
      priority: 70
    },
    {
      category: 'local',
      label: language === 'bn' ? 'স্থানীয়' : 'Local',
      icon: MapPin,
      isEnabled: true,
      priority: 85
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      type: 'newPosts',
      label: language === 'bn' ? 'নতুন পোস্ট' : 'New Posts',
      enabled: true
    },
    {
      type: 'messages',
      label: language === 'bn' ? 'নতুন মেসেজ' : 'New Messages',
      enabled: true
    },
    {
      type: 'likes',
      label: language === 'bn' ? 'লাইক ও রিয়্যাক্ট' : 'Likes & Reactions',
      enabled: false
    },
    {
      type: 'follows',
      label: language === 'bn' ? 'নতুন ফলোয়ার' : 'New Followers',
      enabled: true
    }
  ]);

  const [contentSettings, setContentSettings] = useState({
    autoplay: true,
    highQuality: false,
    darkMode: false,
    compactView: false
  });

  const [feedAlgorithm, setFeedAlgorithm] = useState([70]); // 0-100 for personalization level

  const togglePreference = (category: string) => {
    setPreferences(prev => prev.map(pref => 
      pref.category === category 
        ? { ...pref, isEnabled: !pref.isEnabled }
        : pref
    ));
  };

  const updatePriority = (category: string, priority: number) => {
    setPreferences(prev => prev.map(pref => 
      pref.category === category 
        ? { ...pref, priority }
        : pref
    ));
  };

  const toggleNotification = (type: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.type === type 
        ? { ...notif, enabled: !notif.enabled }
        : notif
    ));
  };

  const updateContentSetting = (setting: string, value: boolean) => {
    setContentSettings(prev => ({ ...prev, [setting]: value }));
  };

  const savePreferences = () => {
    // In a real app, save to backend/local storage
    toast({
      title: language === 'bn' ? 'সেভ হয়েছে' : 'Saved',
      description: language === 'bn' ? 'আপনার পছন্দ সেভ করা হয়েছে' : 'Your preferences have been saved'
    });
  };

  const enabledPreferences = preferences.filter(pref => pref.isEnabled);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'bn' ? 'ব্যক্তিগতকরণ' : 'Personalization'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'bn' 
            ? 'আপনার পছন্দ অনুযায়ী কন্টেন্ট দেখুন' 
            : 'Customize your content experience'
          }
        </p>
      </div>

      <Tabs defaultValue="interests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="interests">
            {language === 'bn' ? 'আগ্রহ' : 'Interests'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifications'}
          </TabsTrigger>
          <TabsTrigger value="content">
            {language === 'bn' ? 'কন্টেন্ট' : 'Content'}
          </TabsTrigger>
          <TabsTrigger value="algorithm">
            {language === 'bn' ? 'ফিড' : 'Feed'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>{language === 'bn' ? 'আপনার আগ্রহের বিষয়' : 'Your Interests'}</span>
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'যে বিষয়গুলোতে আপনি বেশি কন্টেন্ট দেখতে চান তা নির্বাচন করুন'
                  : 'Select topics you want to see more content about'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.map((pref) => (
                <div key={pref.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <pref.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{pref.label}</span>
                    </div>
                    <Switch
                      checked={pref.isEnabled}
                      onCheckedChange={() => togglePreference(pref.category)}
                    />
                  </div>
                  
                  {pref.isEnabled && (
                    <div className="ml-11 space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        {language === 'bn' ? 'অগ্রাধিকার: ' : 'Priority: '}{pref.priority}%
                      </Label>
                      <Slider
                        value={[pref.priority]}
                        onValueChange={([value]) => updatePriority(pref.category, value)}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {enabledPreferences.length} {language === 'bn' ? 'টি বিষয় নির্বাচিত' : 'topics selected'}
              </p>
            </div>
            <Button onClick={savePreferences}>
              {language === 'bn' ? 'সেভ করুন' : 'Save Preferences'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>{language === 'bn' ? 'বিজ্ঞপ্তি সেটিংস' : 'Notification Settings'}</span>
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'কোন ধরনের বিজ্ঞপ্তি পেতে চান তা নির্ধারণ করুন'
                  : 'Choose what notifications you want to receive'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.type} className="flex items-center justify-between">
                  <span className="font-medium">{notif.label}</span>
                  <Switch
                    checked={notif.enabled}
                    onCheckedChange={() => toggleNotification(notif.type)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>{language === 'bn' ? 'কন্টেন্ট সেটিংস' : 'Content Settings'}</span>
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'কন্টেন্ট প্রদর্শনের পছন্দ নির্ধারণ করুন'
                  : 'Customize how content is displayed'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === 'bn' ? 'ভিডিও অটোপ্লে' : 'Video Autoplay'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'ভিডিও স্বয়ংক্রিয়ভাবে চালু হবে' : 'Videos will play automatically'}
                  </p>
                </div>
                <Switch
                  checked={contentSettings.autoplay}
                  onCheckedChange={(value) => updateContentSetting('autoplay', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === 'bn' ? 'উচ্চ মানের ছবি' : 'High Quality Images'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'বেশি ডেটা ব্যবহার হবে' : 'Uses more data'}
                  </p>
                </div>
                <Switch
                  checked={contentSettings.highQuality}
                  onCheckedChange={(value) => updateContentSetting('highQuality', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === 'bn' ? 'কমপ্যাক্ট ভিউ' : 'Compact View'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'ছোট পোস্ট সাইজ' : 'Smaller post sizes'}
                  </p>
                </div>
                <Switch
                  checked={contentSettings.compactView}
                  onCheckedChange={(value) => updateContentSetting('compactView', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>{language === 'bn' ? 'ফিড অ্যালগরিদম' : 'Feed Algorithm'}</span>
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'আপনার ফিডে কি ধরনের কন্টেন্ট দেখতে চান'
                  : 'Customize what appears in your feed'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    {language === 'bn' ? 'ব্যক্তিগতকরণের মাত্রা' : 'Personalization Level'}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feedAlgorithm[0] < 30 
                      ? (language === 'bn' ? 'কম ব্যক্তিগতকরণ - বিভিন্ন ধরনের কন্টেন্ট' : 'Less personalized - diverse content')
                      : feedAlgorithm[0] > 70 
                      ? (language === 'bn' ? 'বেশি ব্যক্তিগতকরণ - আপনার পছন্দ অনুযায়ী' : 'Highly personalized - based on your interests')
                      : (language === 'bn' ? 'মাঝারি ব্যক্তিগতকরণ' : 'Moderate personalization')
                    }
                  </p>
                  <Slider
                    value={feedAlgorithm}
                    onValueChange={setFeedAlgorithm}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{language === 'bn' ? 'বিভিন্ন ধরনের' : 'Diverse'}</span>
                    <span>{language === 'bn' ? 'ব্যক্তিগত' : 'Personal'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">{language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'bn' ? 'জনপ্রিয় পোস্ট' : 'Popular posts'}
                      </p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">{language === 'bn' ? 'পছন্দের' : 'For You'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'bn' ? 'আপনার পছন্দ অনুযায়ী' : 'Based on interests'}
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};