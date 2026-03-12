import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth';
import router from '@/router';

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
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const authStore = useAuthStore();

    if (error.response) {
      const status = error.response.status;

      if (status === 401 && originalRequest && !originalRequest._retry) {
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
          await authStore.logout();

          // Redirect to login, storing the old path to return after a successful login
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath },
          });

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Global Errors handlers
      switch (status) {
        case 400:
          console.error('Bad Request: Invalid input data.');
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access the system this action.');
          break;
        case 404:
          console.error('Not Found: The resource was not found on the system.');
          break;
        case 422:
          console.error('Validation Error: Invalid information.');
          break;
        case 500:
        case 502:
        case 503:
          console.error('Server Status: The system is experiencing disruption, please try again later.');
          break;
      }
    } else if (error.request) {
      console.error('Network Error: Please check your network connection.');
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  },
);
