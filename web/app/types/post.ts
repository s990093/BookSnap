export interface PostImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  created_at: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tag: string;
  images: PostImage[];
  type: PostType;
  author: Author;
  country: Country;
  user: AdminUser;
  created_at: string;
  updated_at: string;
}

export interface PostType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateImage {
  id: number;
  image: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 