<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import { storeToRefs } from 'pinia'

const { categories } = storeToRefs(useCategoriesStore())
</script>

<template>
  <div>
    <div class="wrapper">
      <template v-for="task in categories" :key="task.id">
        <div class="task__wrapper">
          <div
            :class="{ text__crossed: task.status }"
            class="overflow-hidden flex justify-between w-full"
          >
            <div class="mr-4 overflow-hidden text-ellipsis">
              {{ task.title }}
            </div>

            <div class="mr-2">
              {{
                calculate(
                  new Date(task.date.seconds * 1000).toLocaleDateString()
                )
              }}
            </div>
          </div>
          <div>
            <div class="flex items-center w-14 justify-between">
              <div
                :class="{
                  check__off: task.status == false,
                  check__on: task.status == true,
                }"
                @click="edit(task)"
              ></div>
              <Popup
                :delete-handler="deleteTask"
                :id="task.id"
                :change="change"
                :item="task"
              />
            </div>
          </div>
        </div>
      </template>
      <div v-if="visibleInput" class="mt-6">
        <input type="text" v-model="currentChangedTask.title" />
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
