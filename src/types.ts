export interface Summary {
  id: string;
  user_id: string;
  video_url: string;
  video_title: string;
  thumbnail_url: string;
  summary: string;
  keywords: string[];
  category: string;
  language: string;
  length_preference: 'short' | 'medium' | 'detailed';
  rating: number | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}