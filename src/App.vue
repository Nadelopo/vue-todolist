<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { supabase } from './supabase'
import { useTasksStore } from '@/stores/tasksStore'
import { useUserStore } from './stores/userStore'
import Navbar from '@/components/Navbar.vue'
import { useCategoriesStore } from './stores/categoriesStore'

const { userId, user } = storeToRefs(useUserStore())
const { setUserData } = useUserStore()
const { setCategories } = useCategoriesStore()
const { currentCategoryId } = storeToRefs(useCategoriesStore())
const { setTasks, setAllTask } = useTasksStore()

const route = useRoute()

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    if (session && session.user) {
      setUserData(session.user.id)
      setCategories(session.user.id)
      setTasks(session.user.id)
      setAllTask()
    } else {
      userId.value = ''
      user.value = null
    }
    eventValue.value = event
  }
})

watch(
  () => route.query.category,
  (cur) => {
    if (!isNaN(Number(cur))) {
      currentCategoryId.value = cur ? Number(cur) : null
      setTasks(userId.value)
    }
  }
)

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
