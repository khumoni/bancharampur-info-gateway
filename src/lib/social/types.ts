
import { Timestamp } from 'firebase/firestore';
import { Product as MarketplaceProduct } from '../marketplace/types';

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  time: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Post {
  id:string;
  author: string;
  authorId: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  shares: number;
  hashtags: string[];
  profilePicture?: string;
  createdAt: string;
  status: 'active' | 'hidden' | 'deleted';
  moderationDetails?: {
    moderatedBy: string;
    moderatedAt: string;
    reason: string;
    previousStatus: 'active' | 'hidden';
  };
  postType?: 'social' | 'marketplace-share';
  sharedProduct?: MarketplaceProduct;
}

export interface SocialContextType {
  posts: Post[];
  addPost: (content: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  moderatePost: (postId: string, newStatus: 'active' | 'hidden' | 'deleted', reason: string) => Promise<void>;
  shareProductAsPost: (product: MarketplaceProduct, comment: string) => Promise<void>;
  loading: boolean;
}
