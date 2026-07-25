import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_ROUTES = ['/sign-in', '/forgot-password'];

export const authGuard = (to: RouteLocationNormalized) => {
  const user = useAuthStore();
  const isAuthenticated = user.isAuthenticated;

  if (PUBLIC_ROUTES.includes(to.path)) {
    // If an authenticated user tries to access public auth pages, redirect to dashboard
    if (isAuthenticated) {
      return { path: '/dashboard' };
    }
    return true;
  }

  // If the route is private and the user is not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return { path: '/sign-in', query: { redirect: to.fullPath } };
  }

  return true;
};
