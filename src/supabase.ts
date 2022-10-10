import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getUserData = async (userId: string) => {
  const userData = await supabase.from('Users').select().eq('id', userId)
  const user = userData.data?.[0]
  return user
}
