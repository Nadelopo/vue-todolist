<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useTasksStore } from '@/stores/tasksStore'
import Navbar from '@/components/Navbar.vue'

const { currentCategoryId } = useCategoriesStore()
const { setAllTasks, setTasks } = useTasksStore()
const route = useRoute()
const router = useRouter()

const setData = () => {
  setTasks()
  setAllTasks()
}

onMounted(async () => {
  await router.isReady()
  const category = route.query.category
  if (category === undefined || category === null) {
    setData()
    return
  }
  currentCategoryId.value = Number(category)
})

watch(
  () => route.query.category,
  async (cur) => {
    if (route.name !== 'Home') return
    if (cur == currentCategoryId.value) return
    setData()
    currentCategoryId.value = cur ? Number(cur) : null
  },
  { immediate: true }
)
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main class="container">
    <RouterView />
  </main>
</template>
