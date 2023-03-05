import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getOneById } from '@/utils/queries'

export interface User {
  id: string
  email: string
  created_at: Date
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const userId = ref('')

  const setUserData = async (id: string) => {
    userId.value = id
    user.value = await getOneById<User>('Users', id)
  }

  return { user, userId, setUserData }
})
