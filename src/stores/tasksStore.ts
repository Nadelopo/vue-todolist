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
  getters: {
    completedTasks(state) {
      return state.allTasks.filter((t) => t.status).length
    },
    notCompleted(state) {
      return state.allTasks.filter((t) => !t.status).length
    },
  },
  actions: {
    async getTasks(userId: string) {
      const { currentCategoryId } = storeToRefs(useCategoriesStore())
      let request = supabase
        .from<Ttask>('Tasks')
        .select()
        .order('created_at')
        .eq('userId', userId)
      if (currentCategoryId.value) {
        request = request.eq('categoryId', currentCategoryId.value)
      }
      const { data, error } = await request
      if (error) console.log(error)
      if (data) this.tasks = data.reverse()
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
      this.setAllTask()
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
