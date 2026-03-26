import { createRouter, createWebHistory } from 'vue-router';

const Login = () => import('@/features/auth/pages/Login.vue');
const UserManagementEntry = () => import('@/features/users/pages/UserManagementEntry.vue');
const PetManagement = () => import('@/features/pets/pages/PetManagement.vue');
const VaccineManagement = () => import('@/features/vaccines/pages/VaccineManagement.vue');

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/user-management',
    component: UserManagementEntry,
  },
  {
    path: '/pet-management',
    component: PetManagement,
  },
  {
    path: '/vaccine-management',
    component: VaccineManagement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
