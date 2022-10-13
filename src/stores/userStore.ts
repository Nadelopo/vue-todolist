import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export type Tuser = {
  id: string
  email: string
  created_at: Date
}

export const useUserStore = defineStore('user', {
  state: () => {
    const user = ref<Tuser | null>(null)
    const userId = ref('')

    return { user, userId }
  },
  actions: {
    async getUserData(userId: string) {
      const { data, error } = await supabase
        .from<Tuser>('Users')
        .select()
        .eq('id', userId)
        .single()
      if (error) {
        console.log(error)
      }
      return data
    },
  },
})
