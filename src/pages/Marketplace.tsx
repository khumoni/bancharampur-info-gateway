
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  Star,
  MapPin,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Shield
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { CreateListingDialog } from "@/components/marketplace/CreateListingDialog";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";

const Marketplace = () => {
  const { language } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Sample product data
  const sampleProducts = [
    {
      id: "1",
      title: "iPhone 14 Pro Max",
      price: 85000,
      condition: "like-new",
      category: "electronics",
      location: "Bancharampur",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab"],
      description: "Excellent condition iPhone 14 Pro Max, 256GB",
      seller: {
        name: "রহিম উদ্দিন",
        rating: 4.8,
        verified: true
      },
      postedAt: "2 hours ago",
      views: 45,
      likes: 12
    },
    {
      id: "2",
      title: "Honda CB 150R",
      price: 180000,
      condition: "used",
      category: "vehicles",
      location: "Brahmanbaria",
      images: ["https://images.unsplash.com/photo-1558618644-fcd25c85cd64"],
      description: "Well maintained bike, all papers clear",
      seller: {
        name: "করিম আহমেদ",
        rating: 4.6,
        verified: true
      },
      postedAt: "1 day ago",
      views: 120,
      likes: 8
    },
    {
      id: "3",
      title: "Wooden Dining Table",
      price: 15000,
      condition: "new",
      category: "furniture",
      location: "Bancharampur",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
      description: "Brand new handcrafted wooden dining table",
      seller: {
        name: "ফাতেমা খাতুন",
        rating: 4.9,
        verified: false
      },
      postedAt: "3 days ago",
      views: 75,
      likes: 15
    }
  ];

  const categories = [
    { id: "all", name: language === 'bn' ? "সব" : "All" },
    { id: "electronics", name: language === 'bn' ? "ইলেকট্রনিক্স" : "Electronics" },
    { id: "vehicles", name: language === 'bn' ? "যানবাহন" : "Vehicles" },
    { id: "furniture", name: language === 'bn' ? "আসবাবপত্র" : "Furniture" },
    { id: "fashion", name: language === 'bn' ? "ফ্যাশন" : "Fashion" },
    { id: "books", name: language === 'bn' ? "বই" : "Books" },
    { id: "others", name: language === 'bn' ? "অন্যান্য" : "Others" }
  ];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4">
              {language === 'bn' ? 'বাংচারামপুর মার্কেটপ্লেস' : 'Bancharampur Marketplace'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {language === 'bn' 
                ? 'স্থানীয় ক্রয়-বিক্রয় এবং সেবার জন্য আপনার বিশ্বস্ত স্থান' 
                : 'Your trusted place for local buying, selling, and services'}
            </p>
            
            {/* Search and Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === 'bn' ? "কি খুঁজছেন?" : "What are you looking for?"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline" 
                className="h-12 px-6"
              >
                <Filter className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'ফিল্টার' : 'Filters'}
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="h-12 px-6 bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {language === 'bn' ? 'বিজ্ঞাপন দিন' : 'Post Ad'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-80">
                <FilterSidebar language={language} />
              </div>
            )}
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'bn' 
                    ? `${filteredProducts.length} টি পণ্য পাওয়া গেছে` 
                    : `${filteredProducts.length} products found`}
                </p>
                <select className="px-3 py-2 border rounded-md bg-background">
                  <option>{language === 'bn' ? 'সাজান' : 'Sort by'}</option>
                  <option>{language === 'bn' ? 'দাম (কম থেকে বেশি)' : 'Price (Low to High)'}</option>
                  <option>{language === 'bn' ? 'দাম (বেশি থেকে কম)' : 'Price (High to Low)'}</option>
                  <option>{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} language={language} />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                    {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'bn' 
                      ? 'অন্য কিছু খোঁজার চেষ্টা করুন বা ফিল্টার পরিবর্তন করুন' 
                      : 'Try searching for something else or change your filters'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CreateListingDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      <Footer />
    </div>
  );
};

export default Marketplace;
