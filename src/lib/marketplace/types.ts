
export interface Product {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  location: string;
  images: string[];
  description: string;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
  };
  postedAt: string;
  views: number;
  likes: number;
}
