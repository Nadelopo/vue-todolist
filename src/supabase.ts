import { createClient } from '@supabase/supabase-js'
import type { Iuser } from '@/stores/userStore'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getUserData = async (userId: string) => {
  const { data } = await supabase.from<Iuser>('Users').select().eq('id', userId)
  const user = data?.[0] || null
  return user
}
