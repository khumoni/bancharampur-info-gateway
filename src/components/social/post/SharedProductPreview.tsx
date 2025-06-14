
import { Card } from "@/components/ui/card";
import { Product as MarketplaceProduct } from "@/lib/marketplace/types";
import { MapPin } from "lucide-react";

interface SharedProductPreviewProps {
    product: MarketplaceProduct;
}

export const SharedProductPreview = ({ product }: SharedProductPreviewProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('bn-BD').format(price);
    };

    return (
        <Card className="mt-4 border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-gray-50/50">
            <div className="flex gap-4 p-3">
                {product.images && product.images[0] && (
                    <img src={product.images[0]} alt={product.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold line-clamp-2 text-gray-800">{product.title}</h4>
                    <p className="text-lg font-bold text-green-600">৳{formatPrice(product.price)}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{product.location}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
