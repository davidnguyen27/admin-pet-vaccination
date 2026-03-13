import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { authStore, loadingStore } from '@/store';
import router from '@/router';
import type { IResponseError } from '@/interfaces/i-response';
import { message } from 'ant-design-vue';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Race condition prevention
let isRefreshing = false;
let failedQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

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
    loadingStore().start();
    return config;
  },
  (error: AxiosError) => {
    loadingStore().stop();
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    loadingStore().stop();
    return response.data;
  },
  async (error: AxiosError) => {
    loadingStore().stop();
    if (error.response?.data) {
      const errData = error.response.data as IResponseError;
      if (errData.errors) {
        error.message = Array.isArray(errData.errors) ? errData.errors.join(', ') : errData.errors;
      }
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const useAuthStore = authStore();

    if (error.response) {
      const status = error.response.status;

      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        if (isRefreshing) {
          // If a token refresh is already in progress, put other requests into the queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve: () => resolve(undefined), reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh token API. Since HttpOnly cookies are used, the backend will automatically read the refreshToken
          await axiosInstance.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });

          processQueue(null);

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);

          // Refresh token expired and then back to login page
          await useAuthStore.logout();

          // Redirect to login, storing the old path to return after a successful login
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          });

          return Promise.reject(refreshError);
        } finally {
          loadingStore().stop();
          isRefreshing = false;
        }
      }

      // Global Errors handlers
      switch (status) {
        case 400:
          message.error('Bad Request: Invalid input data.');
          console.error(error.message);
          break;
        case 403:
          message.error('Forbidden: You do not have permission to access the system this action.');
          console.error(error.message);
          break;
        case 404:
          message.error('Not Found: The resource was not found on the system.');
          console.error(error.message);
          break;
        case 422:
          message.error('Validation Error: Invalid information.');
          console.error(error.message);
          break;
        case 500:
        case 502:
        case 503:
          message.error('Server Status: The system is experiencing disruption, please try again later.');
          console.error(error.message);
          break;
      }
    } else if (error.request) {
      message.error('Network Error: Please check your network connection.');
      console.error(error.message);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  },
);
