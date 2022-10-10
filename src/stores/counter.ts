import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref({})

  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
  })
  return { user }
})
