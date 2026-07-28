import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/core/constants';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/features/auth/api';

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
  withCredentials: true,
});

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    const originalRequest = error.config as RetryAxiosRequestConfig;
    const url = originalRequest?.url || '';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest._retry = true;
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            return axiosClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const useAuth = useAuthStore();

      try {
        const response: any = await authAPI.refreshToken();
        const accessToken = response?.access_token || response?.data?.access_token;

        if (!accessToken) {
          useAuth.clearUser();
          processQueue(error, null);
          return Promise.reject(error);
        }

        useAuth.setAccessToken(accessToken);
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        processQueue(null, accessToken);
        return axiosClient(originalRequest);
      } catch (err: any) {
        useAuth.clearUser();
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);
