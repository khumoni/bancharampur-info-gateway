
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Store, Plus } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface Props {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  onFilter: () => void;
  onOpenShop: () => void;
  onPostAd: () => void;
}

export const MarketActionBar: FC<Props> = ({
  searchQuery,
  setSearchQuery,
  onFilter,
  onOpenShop,
  onPostAd,
}) => {
  const { language } = useApp();
  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
        <Input
          placeholder={language === "bn" ? "কি খুঁজছেন?" : "What are you looking for?"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>
      <Button
        onClick={onFilter}
        variant="outline"
        className="h-12 px-6"
      >
        <Filter className="mr-2 h-4 w-4" />
        {language === "bn" ? "ফিল্টার" : "Filters"}
      </Button>
      <Button
        onClick={onOpenShop}
        variant="outline"
        className="h-12 px-6 border-green-600 text-green-700 bg-white hover:bg-green-50"
      >
        <Store className="mr-2 h-4 w-4"/>
        {language === "bn" ? "দোকান খোলুন" : "Open Shop"}
      </Button>
      <Button
        onClick={onPostAd}
        className="h-12 px-6 bg-green-600 hover:bg-green-700"
      >
        <Plus className="mr-2 h-4 w-4"/>
        {language === "bn" ? "বিজ্ঞাপন দিন" : "Post Ad"}
      </Button>
    </div>
  );
};
