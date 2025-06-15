
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
