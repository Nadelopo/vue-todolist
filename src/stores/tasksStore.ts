import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './userStore'
import { useCategoriesStore } from './categoriesStore'

import {
  createOne,
  deleteOne,
  getAllByColumns,
  updateOne
} from '@/utils/queries'

export interface CurrentTask {
  id?: number
  title?: string
}

interface Task {
  id: number
  created_at: Date
  title: string
  status: boolean
  categoryId: number
  userId: string
}

export const useTasksStore = defineStore('Tasks', () => {
  const tasks = ref<Task[]>([])
  const allTasks = ref<Task[]>([])

  const completedTasks = computed(() => {
    return allTasks.value.filter((t) => t.status).length
  })

  const notCompletedTasks = computed(() => {
    return allTasks.value.filter((t) => !t.status).length
  })

  const setTasks = async (userId: string) => {
    const { currentCategoryId } = storeToRefs(useCategoriesStore())
    const data = await getAllByColumns<Task>('Tasks', [
      { column: 'userId', value: userId },
      { column: 'categoryId', value: currentCategoryId.value }
    ])
    if (data) tasks.value = data.reverse()
  }

  const setAllTask = async () => {
    const { userId } = storeToRefs(useUserStore())
    const data = await getAllByColumns<Task>('Tasks', [
      { column: 'userId', value: userId.value }
    ])
    if (data) allTasks.value = data
  }

  const addTask = async (title: string, categoryId: number, userId: string) => {
    const data = await createOne<Task>('Tasks', {
      title,
      categoryId,
      userId
    })
    if (data) {
      setTasks(userId)
      setAllTask()
    }
  }

  const updateTask = async (task: CurrentTask) => {
    if (task.id) {
      const data = await updateOne<Task>(
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

  const editTaskStatus = async (task: Task) => {
    const data = await updateOne<Task>(
      'Tasks',
      { status: !task.status },
      task.id
    )

    if (data) {
      tasks.value = tasks.value.map((t) =>
        t.id === task.id ? { ...t, status: data.status } : t
      )
      setAllTask()
    }
  }

  const deleteTask = async (id: number) => {
    const data = await deleteOne<Task>('Tasks', id)
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
})
