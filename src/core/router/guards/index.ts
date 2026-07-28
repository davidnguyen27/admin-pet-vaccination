import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_ROUTES = ['/sign-in'];

export const authGuard = async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore();
  let isAuthenticated = authStore.isAuthenticated;

  // Attempt to restore session if not authenticated but user info exists in localStorage
  if (!isAuthenticated && authStore.user) {
    isAuthenticated = await authStore.restoreSession();
  }

  if (PUBLIC_ROUTES.includes(to.path)) {
    // If an authenticated user tries to access public auth pages, redirect to dashboard
    if (isAuthenticated) {
      return { path: '/statistic' };
    }
    return true;
  }

  // If the route is private and the user is not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return { path: '/sign-in', query: { redirect: to.fullPath } };
  }

  return true;
};
