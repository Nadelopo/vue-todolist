<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore, type CurrentTask } from '@/stores/tasksStore'
import Popup from '@/components/UI/Popup.vue'

const { tasks } = useTasksStore()
const { updateTask, deleteTask } = useTasksStore()

const showChaneTaskInput = ref(false)
const currentChangedTask = ref<CurrentTask>({
  id: 0,
  title: ''
})

const changeTask = (id: number, title: string) => {
  showChaneTaskInput.value = true
  currentChangedTask.value = { id, title }
}

const saveChanges = async () => {
  updateTask(currentChangedTask.value)
  showChaneTaskInput.value = false
}
</script>

<template>
  <div>
    <div class="wrapper">
      <template
        v-for="task in tasks"
        :key="task.id"
      >
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
                  check__on: task.status == true
                }"
                @click="updateTask({ status: !task.status, id: task.id })"
              />
              <Popup
                :id="task.id"
                :title="task.title"
                @delete="deleteTask"
                @change="changeTask"
              />
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="showChaneTaskInput"
        class="mt-6"
      >
        <input
          v-model="currentChangedTask.title"
          type="text"
        />
        <button
          class="mbtn mt-4"
          @click="saveChanges"
        >
          сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.check__off
  transition: .3s
  cursor: pointer
  border-radius: 100px
  width: 30px
  height: 30px
  background: var(--back-main)
  border: 2px solid var(--color)
  &:hover
    box-shadow: var(--shadow-focus)


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
</style>
