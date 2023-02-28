import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  createOne,
  deleteOne,
  getAllByColumn,
  updateOne
} from '@/utils/queries'

export type TCategory = {
  id: number
  created_at: Date
  title: string
  userId: string
}

export const useCategoriesStore = defineStore('categories', {
  state: () => {
    const categories = ref<TCategory[]>([])
    const currentCategoryId = ref<number | null>(null)

    const setCategories = async (userId: string) => {
      const data = await getAllByColumn<TCategory>(
        'Categories',
        'userId',
        userId
      )
      if (data) categories.value = data
    }

    const createCategory = async (title: string, userId: string) => {
      const data = await createOne<TCategory>('Categories', { title, userId })
      if (data) categories.value.push(data)
    }

    const updateCategory = async (title: string, id: number) => {
      const data = await updateOne<TCategory>('Categories', { title }, id)
      if (data) {
        categories.value = categories.value.map((cat) =>
          cat.id == data.id ? { ...cat, title: data.title } : cat
        )
      }
    }

    const deleteCategory = async (categoryId: number) => {
      const data = await deleteOne<TCategory>('Categories', categoryId)
      if (data) {
        categories.value = categories.value.filter((cat) => cat.id !== data.id)
      }
    }

    return {
      categories,
      currentCategoryId,
      setCategories,
      createCategory,
      updateCategory,
      deleteCategory
    }
  }
})
