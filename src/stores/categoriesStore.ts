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
    const categories = ref<TCategory[]>([])
    const currentCategoryId = ref<number | null>()
    return { categories, currentCategoryId }
  },
  actions: {
    async setCategories(userId: string) {
      const { data, error } = await supabase
        .from<TCategory>('Categories')
        .select()
        .eq('userId', userId)
      if (error) console.log(error)
      if (data) this.categories = data
    },
    async createCategory(title: string, userId: string) {
      const { data, error } = await supabase
        .from<TCategory>('Categories')
        .insert({ title, userId })
        .single()

      if (error) console.log(error)
      if (data) this.categories.push(data)
    },
    async updateCategory(title: string, id: number) {
      const { data, error } = await supabase
        .from<TCategory>('Categories')
        .update({ title })
        .eq('id', id)
        .single()
      if (error) console.log(error)
      if (data) {
        this.categories = this.categories.map((cat) =>
          cat.id == data.id ? { ...cat, title: data.title } : cat
        )
      }
    },
    async deleteCategory(categoryId: number) {
      const { data, error } = await supabase
        .from<TCategory>('Categories')
        .delete()
        .eq('id', categoryId)
        .single()
      if (error) console.log(error)
      if (data) {
        this.categories = this.categories.filter((cat) => cat.id !== data.id)
      }
    },
  },
})
