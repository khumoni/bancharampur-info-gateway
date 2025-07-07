export interface Advertisement {
  id: string;
  user_id: string;
  shop_id?: string;
  title: string;
  description: string;
  price?: number;
  category: string;
  location?: string;
  contact_info?: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  featured: boolean;
  expires_at: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShopProduct {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
  stock_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopOrder {
  id: string;
  shop_id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_info?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}