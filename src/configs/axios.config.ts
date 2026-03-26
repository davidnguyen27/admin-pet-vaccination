import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import router from '@/router';
import type { IResponseError } from '@/interfaces/i-response';
import { message } from 'ant-design-vue';
import { appStore } from '@/store/app.store';
import { authStore } from '@/features/auth';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Race condition prevention
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>();
const authBypassPaths = ['/auth/login', '/auth/refresh-token', '/auth/logout'];

const shouldSkipRefresh = (config?: InternalAxiosRequestConfig) => {
  const requestUrl = config?.url;
  if (!requestUrl) {
    return false;
  }

  const requestPath = requestUrl.split('?')[0] ?? '';
  return authBypassPaths.some(path => requestPath.endsWith(path));
};

const processQueue = (error?: unknown) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    appStore().startLoading();

    const useAuthStore = authStore();
    if (useAuthStore.accessToken) {
      config.headers.set('Authorization', `Bearer ${useAuthStore.accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => {
    appStore().stopLoading();
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    appStore().stopLoading();
    return response.data;
  },
  async (error: AxiosError) => {
    appStore().stopLoading();
    if (error.response?.data) {
      const errData = error.response.data as IResponseError;
      if (errData.errors) {
        error.message = Array.isArray(errData.errors) ? errData.errors.join(', ') : errData.errors;
      }
    }

    const originalRequest = error.config as InternalAxiosRequestConfig;
    const useAuthStore = authStore();
    const isRequestRetried = originalRequest ? retriedRequests.has(originalRequest) : false;
    const skipRefreshForRequest = shouldSkipRefresh(originalRequest);

    if (error.response) {
      const status = error.response.status;

      if (status === 401 && originalRequest && !isRequestRetried && !skipRefreshForRequest) {
        if (isRefreshing) {
          // Put other requests into the queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve: () => resolve(axiosInstance(originalRequest)), reject });
          });
        }

        retriedRequests.add(originalRequest);
        isRefreshing = true;

        try {
          const response = await axiosInstance.post('/auth/refresh-token');
          const newToken = response?.data?.accessToken || response?.data?.token;
          if (newToken) {
            useAuthStore.setAccessToken(newToken);
          }

          processQueue();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);

          await useAuthStore.logout();
          message.error('The session has expired, please login again.');

          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          });
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    } else if (error.request) {
      message.error('Network Error: Please check your network connection.');
    }
    return Promise.reject(error);
  },
);
