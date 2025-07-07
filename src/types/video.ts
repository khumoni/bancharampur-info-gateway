export interface Video {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number; // in seconds
  file_size?: number; // in bytes
  view_count: number;
  like_count: number;
  status: 'published' | 'draft' | 'removed';
  created_at: string;
  updated_at: string;
}