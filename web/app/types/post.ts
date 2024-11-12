export interface PostImage {
  id: string;
  image: string;
  altText: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  images: PostImage[];
  type: PostType;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostType {
  PRODUCT = 'PRODUCT',
  PROMOTION = 'PROMOTION',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  OTHER = 'OTHER'
}

export interface TemplateImage {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
} 