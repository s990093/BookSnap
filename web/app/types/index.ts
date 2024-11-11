export interface Post {
  id: number;
  title: string;
  content: string;
  tag: string;
  type: number;
  created_at: string;
  updated_at: string;
  images: PostImage[];
}

export interface PostImage {
  id: number;
  post: number;
  image_url: string;
  alt_text: string;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
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