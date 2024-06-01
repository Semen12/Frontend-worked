// src/routes/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage.vue'
import Guest from '@/views/GuestPage.vue'
import Register from '@/views/RegisterPage.vue'
import Login from '@/views/LoginPage.vue'
import TwoFactor from '@/views/TwoFactorPage.vue'
import ForgotPassword from '@/views/ForgotPasswordPage.vue'
import ResetPassword from '@/views/ResetPasswordPage.vue'
import EmailVerify from '@/views/EmailVerifyPage.vue'
import UserProfile from '@/views/UserProfilePage.vue'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
     /*  redirect: () => {
        const authStore = useAuthStore();
        authStore.fetchUser();
        return authStore.isAuthenticated ? { name: 'Guest' }:{ name: 'Home' }  ;
      }, */
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
      component: TwoFactor
      // meta: { requiresGuest:true , requiresTwoFactor: true },
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
      path: '/home',
      name: 'Home',
      component: HomeView
      // meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue')
      // meta: { requiresAuth: true },
    }
    /* {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },*/
  ]
})

/*router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
  const requiresTwoFactor = to.matched.some((record) => record.meta.requiresTwoFactor)

  /!*if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (requiresGuest && isAuthenticated) {
    next({ name: 'Home' });
  } else if (requiresTwoFactor && !authStore.twoFactorRequired) {
    next({ name: 'Home' });
  } else if (isAuthenticated && authStore.twoFactorRequired && to.path == '/two-factor') {
    next({ name: 'TwoFactor' });
  } else {
    next();
  }*!/
})*/

export default router
