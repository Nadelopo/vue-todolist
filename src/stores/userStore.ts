import { onMounted, ref, watch } from 'vue'
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

    const userId = ref('')

    onMounted(async () => {
      const token = JSON.parse(
        localStorage.getItem('supabase.auth.token') || '{}'
      )?.currentSession?.access_token
      const resp = await supabase.auth.api.getUser(token)
      if (resp.error) {
        console.log(resp.error)
      }
      if (resp.user) {
        userId.value = resp.user.id
      }
      user.value = await getUserData(userId.value)
    })

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') authStateChange.value = true
      else authStateChange.value = false
      if (session && session.user) {
        userId.value = session.user.id
      }
    })

    watch(authStateChange, async () => {
      user.value = await getUserData(userId.value)
    })
    return { user }
  },
})
