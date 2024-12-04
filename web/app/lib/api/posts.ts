import { Post } from "@/app/types";
import { apiClient } from "./base";



interface GetAllParams {
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
}

export const postsApi = {
  async getAll(params?: GetAllParams): Promise<Post[]> {
    return apiClient.fetch<Post[]>('/posts/', {
      params: params
    });
  },

  async getById(id: number): Promise<Post> {
    return apiClient.fetch<Post>(`/posts/${id}/`);
  },

  async create(data: FormData): Promise<Post> {
    return apiClient.fetch<Post>('/posts/', {
      method: 'POST',
      data: data,
    });
  },

  async update(id: number, data: FormData): Promise<Post> {
    return apiClient.fetch<Post>(`/posts/${id}/`, {
      method: 'PUT',
      data: data,
    });
  },

  async delete(id: number): Promise<void> {
    await apiClient.fetch(`/posts/${id}/`, {
      method: 'DELETE',
    });
  }
}; 