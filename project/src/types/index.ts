export type UserType = 'child' | 'guardian' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  avatar_url?: string;
  bio?: string;
}

export interface Content {
  id: string;
  title: string;
  type: 'story' | 'quiz' | 'video';
  url: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}