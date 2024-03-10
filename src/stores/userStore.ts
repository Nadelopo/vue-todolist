import { ref } from 'vue'
import { supabase } from '@/db/supabase'
import type { Tables } from '@/db/types'

export type User = Tables<'Users'>

const user = ref<User | null>(null)

const setUserData = async (id: string | undefined) => {
  const { data, error } = await supabase
    .from('Users')
    .select()
    .eq('id', id!)
    .single()
  if (error) {
    console.error(error)
  }
  user.value = data
}

export const useUserStore = () => {
  return { user, setUserData }
}
