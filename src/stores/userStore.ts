import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase, getUserData } from '@/supabase'

interface Iuser {
  id: string
  email: string
  created_at: Date
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user = ref<Iuser | null>(null)

    const userId = JSON.parse(localStorage.getItem('supabase.auth.token') || '')
      .currentSession.user.id

    getUserData(userId).then((data) => (user.value = data))
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        user.value = await getUserData(session.user.id)
      }
    })
    return { user }
  },
})
