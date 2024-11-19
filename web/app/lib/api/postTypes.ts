import axios from 'axios';
import { PostType } from '@/app/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

export async function getPostTypes() {
  const { data } = await api.get<PostType[]>('/post-types/');
  return data;
}

export async function getPostType(id: number) {
  const { data } = await api.get<PostType>(`/post-types/${id}/`);
  return data;
}

export async function createPostType(typeData: Partial<PostType>) {
  const { data } = await api.post<PostType>('/post-types/', typeData);
  return data;
}

export async function updatePostType(id: number, typeData: Partial<PostType>) {
  const { data } = await api.put<PostType>(`/post-types/${id}/`, typeData);
  return data;
}

export async function deletePostType(id: number) {
  await api.delete(`/post-types/${id}/`);
} 