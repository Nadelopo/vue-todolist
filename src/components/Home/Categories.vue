<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useTasksStore } from '@/stores/tasksStore'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()

const { categories, currentCategoryId } = storeToRefs(useCategoriesStore())
const { setTasks } = useTasksStore()
const { userId } = storeToRefs(useUserStore())

watch(
  () => route.query.category,
  (cur) => {
    currentCategoryId.value = Number(cur)
    setTasks(userId.value)
  }
)
</script>

<template>
  <div>
    <div class="flex justify-center">
      <div class="my-3 scrollcategory">
        <div class="flex items-center">
          <router-link
            class="cbtn"
            :class="{ active: currentCategoryId == null }"
            :to="{ query: { category: null } }"
          >
            все
          </router-link>
        </div>
        <div
          v-for="category in categories"
          :key="category.id"
          class="mx-2 flex items-center"
        >
          <router-link
            class="cbtn"
            :class="{ active: category.id === currentCategoryId }"
            :to="{ query: { category: category.id } }"
          >
            {{ category.title }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.scrollcategory
  display: flex
  height: 52px
  overflow-x: scroll
  overflow-y: hidden
  white-space: nowrap

::-webkit-scrollbar
  width: 12px
::-webkit-scrollbar-track
  background: none
::-webkit-scrollbar-thumb
  background-color: var(--back-second)
  border-radius: 20px
  border: 6px solid var(--back-main)


.plus
  margin-bottom: 10px
  cursor: pointer
  border-radius: 100px
  width: 30px
  height: 30px
  background: #1c1c1c
  border: 2px solid #1c1c1c
  transition: .4s
  &::after
    content: '+'
    color: #fff
    font-size: 40px
    width: 26px
    height: 18px!important
    display: flex
    justify-content: center
    align-items: center
    transition: .4s
  &:hover
    background: #fff
    &::after
      color: #1c1c1c
</style>
