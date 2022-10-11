import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export interface Iuser {
  id: string
  email: string
  created_at: Date
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user = ref<Iuser | null>(null)
    const userId = ref('')

    return { user, userId }
  },
  actions: {
    async getUserData(userId: string) {
      const { data } = await supabase
        .from<Iuser>('Users')
        .select()
        .eq('id', userId)
        .single()
      return data
    },
  },
})
