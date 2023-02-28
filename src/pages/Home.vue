<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categoriesStore'
import Categories from '../components/Home/Categories.vue'
import CreateTask from '../components/Home/CreateTask.vue'

const { currentCategoryId } = storeToRefs(useCategoriesStore())
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
