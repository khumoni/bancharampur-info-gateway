
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Marketplace = () => {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-400 text-2xl">
                <ShoppingCart className="mr-2 h-6 w-6" />
                {language === 'bn' ? 'বাজার' : 'Marketplace'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'bn' 
                  ? 'বাজার পৃষ্ঠা শীঘ্রই আসছে...' 
                  : 'Marketplace coming soon...'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
