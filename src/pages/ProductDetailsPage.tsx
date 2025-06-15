
import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Heart, 
  Share2,
  Phone
} from 'lucide-react';
import { Product } from "@/lib/marketplace/types";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const getConditionLabel = (condition: string, language: string) => {
  const labels: { [key: string]: string } = {
    'new': language === 'bn' ? 'নতুন' : 'New',
    'like-new': language === 'bn' ? 'নতুনের মতো' : 'Like New',
    'good': language === 'bn' ? 'ভালো' : 'Good',
    'fair': language === 'bn' ? 'মোটামুটি' : 'Fair',
    'poor': language === 'bn' ? 'খারাপ' : 'Poor'
  };
  return labels[condition] || condition;
};

const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      'new': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'like-new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'good': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'fair': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'poor': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat( 'bn-BD').format(price);
};

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, loading } = useData();
  const { language } = useApp();
  
  const product = products.find(p => p.id === productId);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Skeleton className="w-full h-[500px] rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">{language === 'bn' ? 'পণ্য পাওয়া যায়নি' : 'Product Not Found'}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{language === 'bn' ? 'দুঃখিত, আপনি যে পণ্যটি খুঁজছেন তা আমরা খুঁজে পাইনি।' : 'Sorry, we couldn\'t find the product you are looking for.'}</p>
            <Button asChild>
              <Link to="/marketplace">
                <ArrowLeft size={16} className="mr-2" />
                {language === 'bn' ? 'মার্কেটপ্লেসে ফিরে যান' : 'Back to Marketplace'}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleWhatsAppChat = () => {
    if (product.seller.phone) {
      const message = language === 'bn' 
        ? encodeURIComponent(`আসসালামু আলাইকুম, আমি "${product.title}" পণ্যটির ব্যাপারে আগ্রহী।`)
        : encodeURIComponent(`Hello, I'm interested in your product "${product.title}" listed on Bancharampur Marketplace.`);
      window.open(`https://wa.me/${product.seller.phone}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/marketplace">
            <ArrowLeft size={16} className="mr-2" />
            {language === 'bn' ? 'মার্কেটপ্লেসে ফিরে যান' : 'Back to Marketplace'}
          </Link>
        </Button>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img src={product.images[0]} alt={product.title} className="w-full h-auto object-cover rounded-t-lg max-h-[500px]" />
              </CardContent>
            </Card>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {product.images.map((img, index) => (
                  <button key={index} className="rounded-md overflow-hidden border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary">
                    <img src={img} alt={`${product.title} - image ${index+1}`} className="w-full h-24 object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex justify-between items-start">
                  <Badge className={getConditionColor(product.condition)}>{getConditionLabel(product.condition, language)}</Badge>
                  <div className="flex items-center space-x-2">
                     <Button variant="ghost" size="icon"><Heart className="h-5 w-5"/></Button>
                     <Button variant="ghost" size="icon"><Share2 className="h-5 w-5"/></Button>
                  </div>
                </div>
                <h1 className="text-2xl font-bold pt-2">{product.title}</h1>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ৳{formatPrice(product.price)}
                </span>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(product.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'বিক্রেতার তথ্য' : 'Seller Information'}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xl font-medium text-green-600 dark:text-green-300">
                        {product.seller.name.charAt(0)}
                       </div>
                       <div>
                        <div className="flex items-center space-x-1 font-semibold">
                          <span>{product.seller.name}</span>
                          {product.seller.verified && <Shield className="h-4 w-4 text-green-500" title="Verified Seller" />}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.seller.rating} রেটিং</span>
                        </div>
                       </div>
                    </div>
                  </div>
                </div>
                
                {product.seller.phone && (
                    <Button onClick={handleWhatsAppChat} size="lg" className="w-full bg-green-500 hover:bg-green-600">
                        <Phone className="mr-2 h-5 w-5" />
                        {language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}
                    </Button>
                )}

                <div>
                  <h3 className="font-semibold mb-2">{language === 'bn' ? 'বিবরণ' : 'Description'}</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">{language === 'bn' ? 'সম্পর্কিত পণ্য' : 'Related Products'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
