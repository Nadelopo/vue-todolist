<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categoriesStore'
import Categories from '../components/Home/Categories.vue'
import CreateTask from '../components/Home/CreateTask.vue'

const { currentCategoryId } = storeToRefs(useCategoriesStore())
const router = useRouter()
const route = useRoute()

router.push({
  query: { category: currentCategoryId.value ?? route.query.category },
})
</script>

<template>
  <div>
    <Categories />
    <CreateTask />
  </div>
</template>
