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
  Store
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useData } from "@/contexts/DataContext";
import { useLocation } from "@/contexts/LocationContext";
import { CreateListingDialog } from "@/components/marketplace/CreateListingDialog";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// Import the shadcn/ui dialog and the shop registration form
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShopRegistrationForm } from "@/components/marketplace/ShopRegistrationForm";
import { HeroSection } from "@/components/marketplace/HeroSection";
import { MarketActionBar } from "@/components/marketplace/MarketActionBar";
import { CategoryTabs } from "@/components/marketplace/CategoryTabs";
import { ProductsGrid } from "@/components/marketplace/ProductsGrid";

const Marketplace = () => {
  const { language } = useApp();
  const { products, loading } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isShopDialogOpen, setIsShopDialogOpen] = useState(false); // NEW: For shop registration modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const { location } = useLocation();

  const categories = [
    { id: "all", name: language === 'bn' ? "সব" : "All" },
    { id: "electronics", name: language === 'bn' ? "ইলেকট্রনিক্স" : "Electronics" },
    { id: "vehicles", name: language === 'bn' ? "যানবাহন" : "Vehicles" },
    { id: "furniture", name: language === 'bn' ? "আসবাবপত্র" : "Furniture" },
    { id: "fashion", name: language === 'bn' ? "ফ্যাশন" : "Fashion" },
    { id: "books", name: language === 'bn' ? "বই" : "Books" },
    { id: "others", name: language === 'bn' ? "অন্যান্য" : "Others" }
  ];

  // Filter by search, category and upazila
  const filteredProducts = products.filter(product => {
    // Match upazila if set
    const matchesUpazila = 
      !location?.upazila || location.upazila === "" ||
      product.location === location.upazila ||
      product.location?.toLowerCase()?.includes(location.upazila.toLowerCase());
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && matchesUpazila;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Search and Action Bar */}
      <MarketActionBar
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onFilter={() => setIsFilterOpen(!isFilterOpen)}
        onOpenShop={() => setIsShopDialogOpen(true)}
        onPostAd={() => setIsCreateDialogOpen(true)}
      />

      {/* Shop Registration Dialog */}
      <Dialog open={isShopDialogOpen} onOpenChange={setIsShopDialogOpen}>
        <DialogContent className="max-w-xl px-0">
          <DialogHeader>
            <DialogTitle>
              {language === "bn" ? "নতুন দোকান খোলার আবেদন" : "Open a New Shop"}
            </DialogTitle>
          </DialogHeader>
          <ShopRegistrationForm />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Filters Sidebar for desktop */}
            {!isMobile && isFilterOpen && (
              <div className="w-80">
                <FilterSidebar language={language} onApply={() => setIsFilterOpen(false)} />
              </div>
            )}
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Category Tabs */}
              <CategoryTabs
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {language === 'bn'
                    ? `${filteredProducts.length} টি পণ্য পাওয়া গেছে`
                    : `${filteredProducts.length} products found`}
                  {!!location?.upazila && (
                    <span className="ml-2 text-green-700 font-medium">
                      ({language === 'bn' ? `${location.upazila}` : `${location.upazila}`})
                    </span>
                  )}
                </p>
                <select className="px-3 py-2 border rounded-md bg-background">
                  <option>{language === 'bn' ? 'সাজান' : 'Sort by'}</option>
                  <option>{language === 'bn' ? 'দাম (কম থেকে বেশি)' : 'Price (Low to High)'}</option>
                  <option>{language === 'bn' ? 'দাম (বেশি থেকে কম)' : 'Price (High to Low)'}</option>
                  <option>{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                </select>
              </div>

              <ProductsGrid
                products={filteredProducts}
                loading={loading}
                upazila={location?.upazila}
              />

            </div>
          </div>
        </div>
      </section>

      {/* Filter Drawer for mobile */}
      {isMobile && (
        <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto max-h-[80vh]">
              <FilterSidebar language={language} onApply={() => setIsFilterOpen(false)} />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <CreateListingDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      <Footer />
    </div>
  );
};

export default Marketplace;
