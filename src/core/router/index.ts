import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@/core/router/guards';

const SignInPage = () => import('@/features/auth/pages/SignInPage.vue');
const ProfilePage = () => import('@/features/auth/pages/ProfilePage.vue');
const StatisticsOverview = () => import('@/features/statistics/pages/StatisticsOverview.vue');
const UserOverviewPage = () => import('@/features/users/pages/UserOverviewPage.vue');
const UserDetailPage = () => import('@/features/users/pages/UserDetailPage.vue');
const CreateUserPage = () => import('@/features/users/pages/CreateUserPage.vue');
const PetManagementPage = () => import('@/features/pets/pages/PetManagementPage.vue');
const VaccineManagementPage = () => import('@/features/vaccines/pages/VaccineManagementPage.vue');
const VaccineDetailPage = () => import('@/features/vaccines/pages/VaccineDetailPage.vue');
const MicrochipManagementPage = () => import('@/features/microchip/pages/MicrochipManagementPage.vue');
const HealthCertificateManagementPage = () =>
  import('@/features/health-certificate/pages/HealthCertificateManagementPage.vue');
const VoucherManagementPage = () => import('@/features/vouchers/pages/VoucherManagementPage.vue');
const DoctorSchedulePage = () => import('@/features/schedules-working/pages/DoctorSchedulePage.vue');
const ShiftDetailPage = () => import('@/features/schedules-working/pages/ShiftDetailPage.vue');
const DoctorScheduleDetailPage = () => import('@/features/schedules-working/pages/DoctorScheduleDetailPage.vue');
const SettingsPage = () => import('@/features/settings/pages/SettingsPage.vue');

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
    path: '/statistic',
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
        path: 'create',
        name: 'CreateUser',
        component: CreateUserPage,
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
  {
    path: '/pet-management',
    component: PetManagementPage,
  },
  {
    path: '/vaccine-management',
    children: [
      {
        path: '',
        name: 'VaccineOverview',
        component: VaccineManagementPage,
      },
      {
        path: ':id',
        name: 'VaccineDetail',
        component: VaccineDetailPage,
      },
    ],
  },
  {
    path: '/microchip-management',
    component: MicrochipManagementPage,
  },
  {
    path: '/health-certificate-management',
    name: 'HealthCertificateManagement',
    component: HealthCertificateManagementPage,
  },
  {
    path: '/voucher-management',
    name: 'VoucherManagement',
    component: VoucherManagementPage,
  },
  {
    path: '/schedules-working',
    children: [
      {
        path: '',
        name: 'DoctorScheduleOverview',
        component: DoctorSchedulePage,
      },
      {
        path: 'shifts/:id',
        name: 'ShiftDetail',
        component: ShiftDetailPage,
      },
      {
        path: 'doctors/:id',
        name: 'DoctorScheduleDetail',
        component: DoctorScheduleDetailPage,
      },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from) => {
  const authResult = await authGuard(to);
  if (authResult !== true) {
    return authResult;
  }

  return true;
});

export default router;
