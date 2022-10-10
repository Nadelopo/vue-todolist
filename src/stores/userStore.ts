import { ref, watch } from 'vue'
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
    const authStateChange = ref(false)

    const userId = ref(
      JSON.parse(localStorage.getItem('supabase.auth.token') || '')
        .currentSession.user.id
    )

    getUserData(userId.value).then((data) => (user.value = data))
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') authStateChange.value = true
      else authStateChange.value = false
      userId.value = session?.user?.id
    })

    watch(authStateChange, async () => {
      user.value = await getUserData(userId.value)
    })
    return { user }
  },
})
