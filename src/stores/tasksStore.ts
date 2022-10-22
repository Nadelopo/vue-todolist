import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './userStore'
import { useCategoriesStore } from './categoriesStore'
import type { TcurrentTask } from '@/components/Home/TaskBlock.vue'

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
    const allTasks = ref<Ttask[]>([])
    return { tasks, allTasks }
  },
  actions: {
    async getTasks(userId: string) {
      const { currentCategoryId } = storeToRefs(useCategoriesStore())
      let Data, Error
      if (currentCategoryId.value) {
        const { data, error } = await supabase
          .from<Ttask>('Tasks')
          .select()
          .order('created_at')
          .eq('userId', userId)
          .eq('categoryId', currentCategoryId.value)
        Data = data
        Error = error
      } else {
        const { data, error } = await supabase
          .from<Ttask>('Tasks')
          .select()
          .order('created_at')
          .eq('userId', userId)
        Data = data
        Error = error
      }
      if (Error) console.log(Error)
      if (Data) this.tasks = Data.reverse()
    },
    async addTask(title: string, categoryId: number, userId: string) {
      const { data, error } = await supabase
        .from<Ttask>('Tasks')
        .insert({
          title,
          categoryId,
          userId,
        })
        .single()
      if (error) console.log(error)
      if (data) this.getTasks(userId)
    },
    async updateTask(task: TcurrentTask) {
      if (task.id) {
        const { data, error } = await supabase
          .from<Ttask>('Tasks')
          .update({ title: task.title })
          .eq('id', task.id)
          .single()
        if (error) console.log(error)
        if (data) {
          this.tasks = this.tasks.map((t) =>
            t.id === task.id ? { ...t, title: data.title } : t
          )
        }
      }
    },
    async editTaskStatus(task: Ttask) {
      const { data, error } = await supabase
        .from<Ttask>('Tasks')
        .update({ status: !task.status })
        .eq('id', task.id)
        .single()

      if (error) console.log(error)
      if (data) {
        this.tasks = this.tasks.map((t) =>
          t.id == task.id ? { ...t, status: data.status } : t
        )
      }
    },
    async deleteTask(id: number) {
      const { data, error } = await supabase
        .from<Ttask>('Tasks')
        .delete()
        .eq('id', id)
        .single()
      if (error) console.log(error)
      if (data) {
        this.tasks = this.tasks.filter((t) => t.id !== id)
      }
    },
    async setAllTask() {
      const { userId } = storeToRefs(useUserStore())
      const { data, error } = await supabase
        .from<Ttask>('Tasks')
        .select()
        .eq('userId', userId.value)
      if (error) console.log(error)
      if (data) this.allTasks = data
    },
  },
})
