export interface Product {
  id: string;
  title: string;
  price: number;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  category: string;
  location: string;
  images: string[];
  description: string;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    phone?: string; // For WhatsApp chat
  };
  createdAt: string; // Changed from postedAt
  views: number;
  likes: number;
}

// Shop category types
export type ShopCategory =
  | 'grocery'
  | 'electronics'
  | 'fashion'
  | 'hardware'
  | 'furniture'
  | 'stationery'
  | 'food'
  | 'sports'
  | 'other';

// Shop owner profile
export interface ShopOwner {
  id: string;
  name: string;
  phone: string;
  email: string;
  verified: boolean;
}

// Main Shop interface
export interface Shop {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  address: string;
  upazila: string;
  district: string;
  photo?: string;
  owner: ShopOwner;
  products?: string[]; // array of product IDs
  createdAt: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
}
