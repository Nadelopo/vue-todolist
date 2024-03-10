import { ref } from 'vue'
import { supabase } from '@/db/supabase'
import { useCategoriesStore } from './categoriesStore'
import type { Tables, TablesUpdate } from '@/db/types'

export type CurrentTask = {
  id: number
  title: string
}

type Task = Tables<'Tasks'>

const tasks = ref<Task[]>([])
const allTasks = ref<{ status: boolean }[]>([])

const setTasks = async () => {
  const { currentCategoryId } = useCategoriesStore()
  const userId = (await supabase.auth.getSession()).data.session?.user.id
  if (userId === undefined) {
    tasks.value = []
    return
  }
  const query = supabase
    .from('Tasks')
    .select()
    .match({ userId: userId })
    .order('created_at', { ascending: false })
  if (currentCategoryId.value) {
    query.match({ categoryId: currentCategoryId.value })
  }
  const { data, error } = await query
  if (error) {
    console.error(error)
    return
  }
  tasks.value = data
}

const setAllTasks = async () => {
  const userId = (await supabase.auth.getSession()).data.session?.user.id
  if (!userId) {
    allTasks.value = []
    return
  }
  const { data, error } = await supabase
    .from('Tasks')
    .select('status')
    .eq('userId', userId)
  if (error) {
    console.error(error)
    return
  }
  allTasks.value = data
}

const addTask = async (title: string, categoryId: number, userId: string) => {
  const { error } = await supabase
    .from('Tasks')
    .insert({ title, categoryId, userId })
  if (error) {
    console.error(error)
    return
  }
  setTasks()
  setAllTasks()
}

const updateTask = async (task: TablesUpdate<'Tasks'> & { id: number }) => {
  const { data, error } = await supabase
    .from('Tasks')
    .update(task)
    .eq('id', task.id)
    .select()
    .single()
  if (error) {
    console.error(error)
    return
  }
  tasks.value = tasks.value.map((t) => (t.id === task.id ? data : t))
  if ('status' in task) {
    setAllTasks()
  }
}

const deleteTask = async (id: number) => {
  const { error } = await supabase.from('Tasks').delete().eq('id', id)
  if (error) {
    console.error(error)
    return
  }
  tasks.value = tasks.value.filter((t) => t.id !== id)
  setAllTasks()
}

export const useTasksStore = () => {
  return {
    tasks,
    allTasks,
    setAllTasks,
    setTasks,
    addTask,
    updateTask,
    deleteTask
  }
}
