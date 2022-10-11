import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export type TCategory = {
  id: number
  created_at: Date
  title: string
  userId: string
}

export const useCategoriesStore = defineStore('categories', {
  state: () => {
    const categories = ref<TCategory[] | null>(null)

    return { categories }
  },
  actions: {
    async setCategories(userId: string) {
      const { data, error } = await supabase
        .from<TCategory>('Categories')
        .select()
        .eq('userId', userId)
      if (error) {
        console.log(error)
      }
      this.categories = data
    },
  },
})
