<script setup lang="ts">
import { useTasksStore } from '@/stores/tasksStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Popup from '@/components/UI/Popup.vue'

export type TcurrentTask = {
  id?: number
  title?: string
}

const { tasks } = storeToRefs(useTasksStore())
const { updateTask, editTaskStatus, deleteTask } = useTasksStore()

const isInputOpen = ref(false)
const currentChangedTask = ref<TcurrentTask>({})

const changeTask = (id: number, title: string) => {
  isInputOpen.value = true
  currentChangedTask.value = {
    id,
    title,
  }
}

const saveChanges = async () => {
  updateTask(currentChangedTask.value)
  isInputOpen.value = false
}
</script>

<template>
  <div>
    <div class="wrapper">
      <template v-for="task in tasks" :key="task.id">
        <div class="task__wrapper">
          <div
            :class="{ text__crossed: task.status }"
            class="overflow-hidden flex justify-between w-full"
          >
            <div class="mr-4 overflow-hidden text-ellipsis">
              {{ task.title }}
            </div>

            <div class="mr-2">
              {{ new Date(task.created_at).toLocaleDateString() }}
            </div>
          </div>
          <div>
            <div class="flex items-center w-14 justify-between">
              <div
                :class="{
                  check__off: task.status == false,
                  check__on: task.status == true,
                }"
                @click="editTaskStatus(task)"
              ></div>
              <Popup
                :id="task.id"
                :delete-handler="deleteTask"
                :change="changeTask"
                :title="task.title"
              />
            </div>
          </div>
        </div>
      </template>
      <div v-if="isInputOpen" class="mt-6">
        <input v-model="currentChangedTask.title" type="text" />
        <button class="mbtn mt-4" @click="saveChanges">сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.check__off
  transition: .3s
  &:hover
    box-shadow: var(--shadow-focus)
  cursor: pointer
  border-radius: 100px
  width: 30px
  height: 30px
  background: var(--back-main)
  border: 2px solid var(--color)


.check__on
  transition: .3s
  cursor: pointer
  border-radius: 100px
  width: 30px
  height: 30px
  background: var(--color)
  border: 2px solid var(--back-main)
  &::after
    content: '✓'
    color: var(--back-main)
    display: flex
    justify-content: center
    align-items: center
  &:hover
    box-shadow: var(--shadow-focus)


.text__crossed
  text-decoration: line-through

hr
  margin-bottom: 10px
  margin-top: 6px
  color: var(--color)

.task__wrapper
  display: flex
  justify-content: space-between
  margin-bottom: 8px
  // background: var(--back-main)
  // border-radius: 8px
  // padding: 4px 6px
</style>
