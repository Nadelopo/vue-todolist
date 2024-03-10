<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categoriesStore'
import Categories from '../components/Home/Categories.vue'
import CreateTask from '../components/Home/CreateTask.vue'

const { currentCategoryId } = useCategoriesStore()
const router = useRouter()

router.push({
  query: { category: currentCategoryId.value ?? null }
})
</script>

<template>
  <div>
    <Categories />
    <CreateTask />
  </div>
</template>
