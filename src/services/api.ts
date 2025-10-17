import axios from 'axios';
import { API_URL } from '@/config/constants';
import { auth } from './auth';
import type { Profile, ProfileData, FeedResponse } from '@/types';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get('/api/profile');
    return data;
  },

  updateProfile: async (profileData: ProfileData): Promise<Profile> => {
    const { data } = await api.put('/api/profile', profileData);
    return data;
  },
};

export const feedApi = {
  getFeed: async (params?: {
    limit?: number;
    offset?: number;
    includeExpired?: boolean;
  }): Promise<FeedResponse> => {
    const { data } = await api.get('/api/feed', { params });
    return data;
  },
};
