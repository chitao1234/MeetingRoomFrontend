import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth, checkIsAdmin } from '@/api/auth'
import RegisterView from '@/views/RegisterView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rooms',
      component: () => import('@/views/RoomsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bookings',
      component: () => import('@/views/BookingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = await checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 