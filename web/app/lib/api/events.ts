import { AxiosRequestConfig } from 'axios';
import { ApiClient } from './base';
import { Event } from '@/app/types';

export interface CreateEventDTO {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export type UpdateEventDTO = Partial<CreateEventDTO>


export class EventsAPI {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getEvents(params?: AxiosRequestConfig): Promise<Event[]> {
    return this.apiClient.fetch<Event[]>('/events/', {
      params: params
    });
  }

  async getEvent(id: string): Promise<Event> {
    return this.apiClient.fetch<Event>(`/events/${id}`);
  }

  async createEvent(data: CreateEventDTO): Promise<Event> {
    return this.apiClient.fetch<Event>('/events', {
      method: 'POST',
      data: data,
    });
  }

  async updateEvent(id: string, data: UpdateEventDTO): Promise<Event> {
    return this.apiClient.fetch<Event>(`/events/${id}`, {
      method: 'PATCH',
      data: data,
    });
  }

  async deleteEvent(id: string): Promise<void> {
    return this.apiClient.fetch<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }
}

export const eventsAPI = new EventsAPI(); 