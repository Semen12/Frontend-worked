// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import Guest from '@/views/GuestPage.vue'
import Register from '@/views/RegisterPage.vue'
import Login from '@/views/LoginPage.vue'
import TwoFactor from '@/views/TwoFactorPage.vue'
import ForgotPassword from '@/views/ForgotPasswordPage.vue'
import ResetPassword from '@/views/ResetPasswordPage.vue'
import ResetMasterPassword from '@/views/ResetMasterPasswordPage.vue'
import EmailVerify from '@/views/EmailVerifyPage.vue'
import UserProfile from '@/views/UserProfilePage.vue'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
      redirect: () => {
        const authStore = useAuthStore();
        authStore.fetchUser();
        return authStore.isAuthenticated ? { name: 'Guest' }:{ name: 'Home' }  ;
      },
    },
    {
      path: '/guest',
      name: 'Guest',
      component: Guest,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/two-factor',
      name: 'TwoFactor',
      component: TwoFactor,
      meta: { requiresGuest:true , requiresTwoFactor: true },
    },
    {
      path: '/password-forgot',
      name: 'PasswordForgot',
      component: ForgotPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: ResetPassword,
      meta: { requiresGuest: true }
    },
    {
      path:'/email-verify',
      name: 'EmailVerify',
      component: EmailVerify,
      meta: { requiresAuth: true }
    },
    {
      path:'/user',
      name: 'UserProfile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/reset-master-password',
      name: 'ResetMasterPassword',
      component: ResetMasterPassword,
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomePage,
      meta: { requiresAuth: true },
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ]
})
/* 
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  try {
    // Проверяем, если мы не получили пользователя, то пытаемся его получить
    if (!authStore.user) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);

    // Перенаправляем пользователя на страницу входа, если не удалось получить данные пользователя
    return next({ name: 'Login' });
  }
  // Если маршрут требует аутентификацию и пользователь не аутентифицирован
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' });
  }
  // Если маршрут требует гостя, а пользователь аутентифицирован
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'Home' });
  }
   // Добавляем проверку для маршрута '/two-factor'
   if (to.path === '/two-factor' && !authStore.isAuthenticated && authStore.twoFactorRequired) {
    return next();
  }
   // Если маршрут требует двухфакторную аутентификацию
  if (to.meta.requiresTwoFactor && !authStore.twoFactorRequired) {
    return next({ name: 'Login' });
  }
 
  next();
});  */
export default router
