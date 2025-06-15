
import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";

interface Props {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

export const CategoryTabs: FC<Props> = ({ selectedCategory, setSelectedCategory }) => {
  const { language } = useApp();
  const categories = [
    { id: "all", name: language === 'bn' ? "সব" : "All" },
    { id: "electronics", name: language === 'bn' ? "ইলেকট্রনিক্স" : "Electronics" },
    { id: "vehicles", name: language === 'bn' ? "যানবাহন" : "Vehicles" },
    { id: "furniture", name: language === 'bn' ? "আসবাবপত্র" : "Furniture" },
    { id: "fashion", name: language === 'bn' ? "ফ্যাশন" : "Fashion" },
    { id: "books", name: language === 'bn' ? "বই" : "Books" },
    { id: "others", name: language === 'bn' ? "অন্যান্য" : "Others" }
  ];
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
        {categories.map(category => (
          <TabsTrigger key={category.id} value={category.id} className="text-xs">
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
