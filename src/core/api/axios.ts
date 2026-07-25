import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/core/constants';
import { useAuthStore } from '@/store/authStore';

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const useAuth = useAuthStore();

    if (useAuth.accessToken) {
      config.headers.set('Authorization', `Bearer ${useAuth.accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const useAuth = useAuthStore();
      useAuth.setAccessToken(null);
    }

    return Promise.reject(error.response?.data);
  },
);
