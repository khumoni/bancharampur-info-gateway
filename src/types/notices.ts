
export interface Notice {
  id: string;
  type: 'electricity' | 'weather' | 'gas' | 'emergency';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  isActive: boolean;
}
