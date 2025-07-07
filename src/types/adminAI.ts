export interface Stats {
  totalUsers: number;
  pendingShops: number;
  totalPosts: number;
  unresolvedReports: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}