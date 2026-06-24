import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/core/constants';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/features/auth/api';

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = useAuthStore();

    if (auth.accessToken) {
      config.headers.set('Authorization', `Bearer ${auth.accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error.response?.data);
  },
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;
    const url = originalRequest.url || '';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      const auth = useAuthStore();

      try {
        const response = await authAPI.refreshToken();
        const accessToken = response.data?.accessToken;

        if (!auth.accessToken) {
          auth.setAccessToken(null);
          return Promise.reject(error);
        }
        auth.setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        // Handle refresh token error
        auth.setAccessToken(null);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error.response?.data);
  },
);
