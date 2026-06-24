import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const publicRoutes = ['/sign-in', '/forgot-password'];

export const authGuard = (to: RouteLocationNormalized) => {
  const user = useAuthStore();
  const isAuthenticated = user.isAuthenticated;

  // Check if the route is public
  if (publicRoutes.includes(to.path)) {
    // If an authenticated user tries to access public auth pages, redirect to dashboard
    if (isAuthenticated) {
      return { path: '/dashboard' };
    }
    // Otherwise, allow access to the public route
    return true;
  }

  // If the route is private and the user is not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return { path: '/sign-in', query: { redirect: to.fullPath } };
  }

  // User is authenticated and allowed to access the route
  return true;
};
