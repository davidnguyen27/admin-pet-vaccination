import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@/core/router/guards';

const SignInPage = () => import('@/features/auth/pages/SignInPage.vue');
const ForgotPasswordPage = () => import('@/features/auth/pages/ForgotPasswordPage.vue');
const ProfilePage = () => import('@/features/auth/pages/ProfilePage.vue');
const StatisticsOverview = () => import('@/features/statistics/pages/StatisticsOverview.vue');
const UserOverviewPage = () => import('@/features/users/pages/UserOverviewPage.vue');
const UserDetailPage = () => import('@/features/users/pages/UserDetailPage.vue');
// const PetManagement = () => import('@/features/pets/views/PetManagement.vue');
// const VaccineManagement = () => import('@/features/vaccines/views/VaccineManagement.vue');
// const MicrochipManagement = () => import('@/features/microchips/views/MicrochipManagement.vue');
// const SettingsView = () => import('@/features/settings/views/SettingsView.vue');

const routes = [
  {
    path: '/',
    redirect: '/sign-in',
  },
  {
    path: '/sign-in',
    component: SignInPage,
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: '/dashboard',
    component: StatisticsOverview,
  },
  {
    path: '/user-management',
    children: [
      {
        path: '',
        name: 'UserOverview',
        component: UserOverviewPage,
      },
      {
        path: ':id',
        name: 'UserDetail',
        component: UserDetailPage,
      },
    ],
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
  // {
  //   path: '/pet-management',
  //   component: PetManagement,
  // },
  // {
  //   path: '/vaccine-management',
  //   component: VaccineManagement,
  // },
  // {
  //   path: '/microchip-management',
  //   component: MicrochipManagement,
  // },
  // {
  //   path: '/settings',
  //   component: SettingsView,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from) => {
  // Check Authentication Guard
  const authResult = await authGuard(to);
  if (authResult !== true) {
    return authResult;
  }

  // Allow navigation if all guards pass
  return true;
});

export default router;
