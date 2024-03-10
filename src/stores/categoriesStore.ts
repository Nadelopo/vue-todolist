import { ref } from 'vue'
import { supabase } from '@/db/supabase'
import type { Tables } from '@/db/types'

export type Category = Tables<'Categories'>

const categories = ref<Category[]>([])
const currentCategoryId = ref<number | null>(null)

const setCategories = async (userId: string | undefined) => {
  if (userId === undefined) {
    categories.value = []
    return
  }
  const { data, error } = await supabase
    .from('Categories')
    .select()
    .eq('userId', userId)
  if (error) {
    console.error(error)
    return
  }
  categories.value = data
}

const createCategory = async (title: string, userId: string) => {
  const { data, error } = await supabase
    .from('Categories')
    .insert({ title, userId })
    .select()
    .single()
  if (error) {
    console.error(error)
    return
  }
  categories.value.push(data)
}

const updateCategory = async (title: string, id: number) => {
  const { error } = await supabase
    .from('Categories')
    .update({ title })
    .eq('id', id)
  if (error) {
    console.error(error)
    return
  }
  categories.value = categories.value.map((cat) =>
    cat.id === id ? { ...cat, title: title } : cat
  )
}

const deleteCategory = async (categoryId: number) => {
  const { error } = await supabase
    .from('Categories')
    .delete()
    .eq('id', categoryId)
  if (error) {
    console.error(error)
    return
  }
  categories.value = categories.value.filter((cat) => cat.id !== categoryId)
}

export const useCategoriesStore = () => {
  return {
    categories,
    currentCategoryId,
    setCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
