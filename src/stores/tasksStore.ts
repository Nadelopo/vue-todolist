import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import { useUserStore } from './userStore'
import { useCategoriesStore } from './categoriesStore'
import type { TcurrentTask } from '@/components/Home/TaskBlock.vue'
import {
  createOne,
  getAllByColumn,
  getAllByColumns,
  updateOne
} from '@/utils/queries'

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

    const completedTasks = computed(() => {
      return allTasks.value.filter((t) => t.status).length
    })

    const notCompletedTasks = computed(() => {
      return allTasks.value.filter((t) => !t.status).length
    })

    const setTasks = async (userId: string) => {
      const { currentCategoryId } = storeToRefs(useCategoriesStore())
      const data = await getAllByColumns<Ttask>('Tasks', [
        { column: 'userId', value: userId },
        { column: 'categoryId', value: currentCategoryId.value }
      ])
      if (data) tasks.value = data.reverse()
    }

    const setAllTask = async () => {
      const { userId } = storeToRefs(useUserStore())
      const data = await getAllByColumn<Ttask>('Tasks', 'userId', userId.value)
      if (data) allTasks.value = data
    }

    const addTask = async (
      title: string,
      categoryId: number,
      userId: string
    ) => {
      const data = await createOne<Ttask>('Tasks', {
        title,
        categoryId,
        userId
      })
      if (data) {
        setTasks(userId)
        setAllTask()
      }
    }

    const updateTask = async (task: TcurrentTask) => {
      if (task.id) {
        const data = await updateOne<Ttask>(
          'Tasks',
          { title: task.title },
          task.id
        )
        if (data) {
          tasks.value = tasks.value.map((t) =>
            t.id === task.id ? { ...t, title: data.title } : t
          )
        }
      }
    }

    const editTaskStatus = async (task: Ttask) => {
      const data = await updateOne<Ttask>(
        'Tasks',
        { status: !task.status },
        task.id
      )

      if (data) {
        tasks.value = tasks.value.map((t) =>
          t.id == task.id ? { ...t, status: data.status } : t
        )
        setAllTask()
      }
    }

    const deleteTask = async (id: number) => {
      const { data, error } = await supabase
        .from<Ttask>('Tasks')
        .delete()
        .eq('id', id)
        .single()
      if (error) console.log(error)
      if (data) {
        tasks.value = tasks.value.filter((t) => t.id !== id)
        setAllTask()
      }
    }
    return {
      tasks,
      allTasks,
      completedTasks,
      notCompletedTasks,
      setTasks,
      setAllTask,
      addTask,
      updateTask,
      editTaskStatus,
      deleteTask
    }
  }
})
