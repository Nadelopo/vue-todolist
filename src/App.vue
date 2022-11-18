<script setup lang="ts">
import { useTasksStore } from '@/stores/tasksStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import { useUserStore } from './stores/userStore'
import { supabase } from './supabase'
import Navbar from '@/components/Navbar.vue'
import { useCategoriesStore } from './stores/categoriesStore'
import { useRoute } from 'vue-router'

const route = useRoute()

const { userId, user } = storeToRefs(useUserStore())
const { getUserData } = useUserStore()
const { setCategories } = useCategoriesStore()
const { getTasks, setAllTask } = useTasksStore()
const { currentCategoryId } = storeToRefs(useCategoriesStore())

onBeforeMount(async () => {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
    ?.currentSession?.access_token
  if (token) {
    const { user: User, error } = await supabase.auth.api.getUser(token)
    currentCategoryId.value = Number(route.query.category) || null
    if (User) {
      userId.value = User.id
      user.value = await getUserData(User.id)
      setCategories(User.id)
      getTasks(User.id)
      setAllTask()
    }
    if (error) console.log(error)
  }
})

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    userId.value = session.user.id
    user.value = await getUserData(session.user.id)
    setCategories(session.user.id)
    getTasks(session.user.id)
  } else {
    userId.value = ''
    user.value = null
  }
})

const theme = ref(localStorage.getItem('theme') || 'dark')
document.documentElement.setAttribute('data-theme', theme.value)
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
