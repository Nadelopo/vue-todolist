import { supabase } from '@/db/supabase'
import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/Main.vue'),
      meta: { auth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../pages/Home.vue')
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../pages/Profile.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../pages/Auth.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  const requireAuth = to.matched.some((record) => record.meta.auth)
  if (!requireAuth) return true
  const store = useUserStore()
  if (store.user.value) return true
  const { data } = await supabase.auth.getUser()
  if (data.user) return true
  return { name: 'Auth' }
})

export default router
