import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Play, Heart, MessageCircle, Share2, Clock, Settings, Filter } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/lib/translations";

const Videos = () => {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videoQuality, setVideoQuality] = useState("720p");
  const [autoplay, setAutoplay] = useState(false);

  // Mock video data - replace with real data from your backend
  const videoCategories = [
    { id: "all", name: language === 'bn' ? "সব" : "All" },
    { id: "education", name: language === 'bn' ? "শিক্ষা" : "Education" },
    { id: "agriculture", name: language === 'bn' ? "কৃষি" : "Agriculture" },
    { id: "health", name: language === 'bn' ? "স্বাস্থ্য" : "Health" },
    { id: "local", name: language === 'bn' ? "স্থানীয়" : "Local" },
    { id: "news", name: language === 'bn' ? "সংবাদ" : "News" },
  ];

  const mockVideos = [
    {
      id: "1",
      title: language === 'bn' ? "আধুনিক চাষাবাদ পদ্ধতি" : "Modern Farming Techniques",
      description: language === 'bn' ? "আধুনিক প্রযুক্তি ব্যবহার করে কিভাবে চাষাবাদ করবেন" : "Learn how to farm using modern technology",
      thumbnail: "/placeholder.svg",
      duration: "15:30",
      views: 1250,
      likes: 89,
      category: "agriculture",
      uploadedAt: "2 days ago",
      author: language === 'bn' ? "কৃষি বিশেষজ্ঞ" : "Agriculture Expert"
    },
    {
      id: "2", 
      title: language === 'bn' ? "স্বাস্থ্য সেবা নির্দেশিকা" : "Healthcare Guidelines",
      description: language === 'bn' ? "প্রাথমিক চিকিৎসা ও স্বাস্থ্য সেবা সম্পর্কে জানুন" : "Learn about primary healthcare and medical services",
      thumbnail: "/placeholder.svg",
      duration: "22:15",
      views: 890,
      likes: 67,
      category: "health",
      uploadedAt: "1 week ago",
      author: language === 'bn' ? "ডাক্তার" : "Doctor"
    },
    {
      id: "3",
      title: language === 'bn' ? "বাঞ্ছারামপুর পরিচিতি" : "Introduction to Bancharampur",
      description: language === 'bn' ? "আমাদের এলাকার ইতিহাস ও ঐতিহ্য" : "History and heritage of our area",
      thumbnail: "/placeholder.svg",
      duration: "18:45",
      views: 2100,
      likes: 156,
      category: "local",
      uploadedAt: "3 days ago",
      author: language === 'bn' ? "স্থানীয় ইতিহাসবিদ" : "Local Historian"
    }
  ];

  const filteredVideos = mockVideos.filter(video => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            {language === 'bn' ? "ভিডিও সেকশন" : "Video Section"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? "শিক্ষামূলক ও তথ্যবহুল ভিডিওর সংগ্রহ দেখুন" 
              : "Watch our collection of educational and informative videos"
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative max-w-md mx-auto md:mx-0 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={language === 'bn' ? "ভিডিও খুঁজুন..." : "Search videos..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'কোয়ালিটি' : 'Quality'}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'ফিল্টার' : 'Filter'}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {videoCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="min-w-fit"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{video.author}</span>
                  <span>{video.uploadedAt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{video.views.toLocaleString()} {language === 'bn' ? 'বার দেখা হয়েছে' : 'views'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {video.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'bn' ? "কোন ভিডিও পাওয়া যায়নি" : "No videos found"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Videos;