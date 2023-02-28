<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { supabase } from './supabase'
import { useTasksStore } from '@/stores/tasksStore'
import { useUserStore } from './stores/userStore'
import Navbar from '@/components/Navbar.vue'
import { useCategoriesStore } from './stores/categoriesStore'

const route = useRoute()

const { userId, user } = storeToRefs(useUserStore())
const { setUserData } = useUserStore()
const { setCategories } = useCategoriesStore()
const { setTasks, setAllTask } = useTasksStore()
const { currentCategoryId } = storeToRefs(useCategoriesStore())

//fix
onBeforeMount(async () => {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
    ?.currentSession?.access_token
  if (token) {
    const { user: User, error } = await supabase.auth.api.getUser(token)
    currentCategoryId.value = Number(route.query.category) || null
    if (User) {
      setUserData(User.id)
      setCategories(User.id)
      setTasks(User.id)
      setAllTask()
    }
    if (error) console.log(error)
  }
})

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    if (session && session.user) {
      setUserData(session.user.id)
      setCategories(session.user.id)
      setTasks(session.user.id)
    } else {
      userId.value = ''
      user.value = null
    }
    eventValue.value = event
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
