<script setup lang="ts">
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasksStore'

const { allTasks } = useTasksStore()

const completedTasks = computed(() => {
  return allTasks.value.filter((t) => t.status).length
})
const notCompletedTasks = computed(() => {
  return allTasks.value.filter((t) => !t.status).length
})
</script>

<template>
  <div class="mb-6">
    <div class="font-medium text-lg mb-4">Обзор задач</div>
    <div class="flex gap-2">
      <div class="task__wrapper">
        <div>{{ completedTasks }}</div>
        <div class="text-center">Завершенные задачи</div>
      </div>
      <div class="task__wrapper">
        <div>{{ notCompletedTasks }}</div>
        <div class="text-center">Не завершенные задачи</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.task__wrapper
  flex-direction: column
  padding: 15px
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  border-radius: 8px
  background: var(--back-second)
  min-height: 90px
</style>
