
import { FC } from "react";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ShoppingCart } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useLocation } from "@/contexts/LocationContext";
import { Product } from "@/lib/marketplace/types";

interface Props {
  products: Product[];
  loading: boolean;
  upazila?: string;
}

export const ProductsGrid: FC<Props> = ({ products, loading, upazila }) => {
  const { language } = useApp();

  if (!loading && products.length === 0)
    return (
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
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </div>
  );
};
