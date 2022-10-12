<script setup lang="ts">
import { useTasksStore } from '@/stores/tasksStore'
import Categories from '../components/Home/Categories.vue'
import CreateTask from '../components/Home/CreateTask.vue'

const { getTasks } = useTasksStore()

getTasks()
</script>

<template>
  <div>
    <Categories />
    <CreateTask />
  </div>
</template>
