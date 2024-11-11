import axios from 'axios';
import { Post } from '@/app/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

interface GetPostsOptions {
  limit?: number;
  offset?: number;
  type?: number;
}

// 獲取所有貼文，支持分頁和過濾
export async function getPosts(options: GetPostsOptions = {}) {
  const { data } = await api.get<Post[]>('/posts/', { params: options });
  return data;
}

// 獲取單個貼文
export async function getPost(id: number) {
  const { data } = await api.get<Post>(`/posts/${id}/`);
  return data;
}

// 創建貼文，支持多圖片上傳
export async function createPost(formData: FormData) {
  const { data } = await api.post<Post>('/posts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

// 更新貼文
export async function updatePost(id: number, formData: FormData) {
  const { data } = await api.put<Post>(`/posts/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

// 刪除貼文
export async function deletePost(id: number) {
  await api.delete(`/posts/${id}/`);
}

// 獲取最近的貼文
export async function getRecentPosts(limit: number = 5) {
  const { data } = await api.get<Post[]>('/posts/recent/', { params: { limit } });
  return data;
} 