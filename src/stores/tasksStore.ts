import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './userStore'
import { useCategoriesStore } from './categoriesStore'

export type Ttask = {
  id: number
  created_at: Date
  title: string
  status: boolean
  categoryId: number
  userId: string
}

export const useTasksStore = defineStore('tasks', {
  state: () => {
    const tasks = ref<Ttask[]>([])
    return { tasks }
  },
  actions: {
    async getTasks() {
      const { userId } = storeToRefs(useUserStore())
      const { currentCategory } = storeToRefs(useCategoriesStore())
      let Data, Error
      if (currentCategory.value) {
        const { data, error } = await supabase
          .from<Ttask>('Tasks')
          .select()
          .eq('userId', userId.value)
          .eq('categoryId', currentCategory.value)
        Data = data
        Error = error
      } else {
        const { data, error } = await supabase
          .from<Ttask>('Tasks')
          .select()
          .eq('userId', userId.value)
        Data = data
        Error = error
      }
      if (Error) console.log(Error)
      if (Data) this.tasks = Data
    },
  },
})
