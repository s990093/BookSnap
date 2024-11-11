import axios from 'axios';
import { Event } from '@/app/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

export async function getEvents(options: { limit?: number; offset?: number; upcoming?: boolean } = {}) {
  const { data } = await api.get<Event[]>('/events/', { params: options });
  return data;
}

export async function getEvent(id: number) {
  const { data } = await api.get<Event>(`/events/${id}/`);
  return data;
}

export async function createEvent(eventData: Partial<Event>) {
  const { data } = await api.post<Event>('/events/', eventData);
  return data;
}

export async function updateEvent(id: number, eventData: Partial<Event>) {
  const { data } = await api.put<Event>(`/events/${id}/`, eventData);
  return data;
}

export async function deleteEvent(id: number) {
  await api.delete(`/events/${id}/`);
} 