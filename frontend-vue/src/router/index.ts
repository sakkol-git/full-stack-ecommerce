import ProductDashboard from '@/views/ProductDashboard.vue'
import UserDashboard from '@/views/UserDashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserDashboard,
    },
    {
      path: '/product',
      name: 'product',
      component: ProductDashboard,
    },
  ],
})

export default router
