import axios from 'axios';
import { TemplateImage } from '@/app/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

interface GetTemplatesParams {
  limit?: number;
  offset?: number;
}

export async function getTemplates(params?: GetTemplatesParams) {
  const { data } = await api.get<TemplateImage[]>('/template-images/', {
    params: {
      limit: params?.limit,
      offset: params?.offset,
    }
  });
  return data;
}

export async function getTemplate(id: number) {
  const { data } = await api.get<TemplateImage>(`/template-images/${id}/`);
  return data;
}

export async function createTemplate(formData: FormData) {
  const { data } = await api.post<TemplateImage>('/template-images/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function updateTemplate(id: number, formData: FormData) {
  const { data } = await api.put<TemplateImage>(`/template-images/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function deleteTemplate(id: number) {
  await api.delete(`/template-images/${id}/`);
} 