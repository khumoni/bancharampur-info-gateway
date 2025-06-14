import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MapPin, 
  Clock, 
  Star,
  Shield,
  Eye
} from "lucide-react";
import { Product } from "@/lib/marketplace/types";
import { useSocial } from "@/contexts/SocialContext";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { language } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [showSellerInfo, setShowSellerInfo] = useState(false);
  const { shareProductAsPost } = useSocial();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      'new': language === 'bn' ? 'নতুন' : 'New',
      'like-new': language === 'bn' ? 'নতুনের মতো' : 'Like New',
      'good': language === 'bn' ? 'ভালো' : 'Good',
      'fair': language === 'bn' ? 'মোটামুটি' : 'Fair',
      'poor': language === 'bn' ? 'খারাপ' : 'Poor'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleShareToFeed = async () => {
    try {
      const comment = language === 'bn' 
        ? `এই পণ্যটি দেখুন: ${product.title}`
        : `Check out this item: ${product.title}`;
        
      await shareProductAsPost(product, comment);
      
      toast({
        title: language === 'bn' ? "ফিডে শেয়ার হয়েছে!" : "Shared to feed!",
        description: language === 'bn' ? "পণ্যটি কমিউনিটি ফিডে পোস্ট করা হয়েছে।" : "The product has been posted to the community feed.",
      });
    } catch (error) {
      console.error('Error sharing product to feed:', error);
      toast({
        title: language === 'bn' ? "ত্রুটি" : "Error",
        description: language === 'bn' ? "পণ্যটি শেয়ার করা যায়নি।" : "Could not share product to feed.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setShowSellerInfo(true)}
      onMouseLeave={() => setShowSellerInfo(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleShareToFeed();
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={getConditionColor(product.condition)}>
            {getConditionLabel(product.condition)}
          </Badge>
        </div>

        {/* Seller Info Overlay */}
        {showSellerInfo && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-medium">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">{product.seller.name}</span>
                    {product.seller.verified && (
                      <Shield className="h-3 w-3 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.seller.rating}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="h-7 px-3 text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                {language === 'bn' ? 'চ্যাট' : 'Chat'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ৳{formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

        {/* Location and Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{product.postedAt}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{product.likes}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs">
            {language === 'bn' ? 'বিস্তারিত' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
