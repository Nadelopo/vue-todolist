import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import { useRoute } from 'vue-router'

export type TCategory = {
  id: number
  created_at: Date
  title: string
  userId: string
}

export const useCategoriesStore = defineStore('categories', {
  state: () => {
    const categories = ref<TCategory[]>([])

    const route = useRoute()
    const currentCategory = computed(() => Number(route.query.category) || null)
    return { categories, currentCategory }
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
      if (data !== null) {
        this.categories = data
      }
    },
    addCategory(category: TCategory) {
      this.categories.push(category)
    },
    deleteFromCategories(categoryId: number) {
      this.categories = this.categories.filter((cat) => cat.id !== categoryId)
    },
    updateCategory(category: TCategory) {
      this.categories = this.categories.map((cat) =>
        cat.id == category.id ? { ...cat, title: category.title } : cat
      )
    },
  },
  getters: {},
})
