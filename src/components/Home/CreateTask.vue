<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'
import Swal from 'sweetalert2'
import TaskBlock from '@/components/Home/TaskBlock.vue'
import { useUserStore } from '@/stores/userStore'
import { useCategoriesStore, type Category } from '@/stores/categoriesStore'
import { useTasksStore } from '@/stores/tasksStore'
import TickSVG from '@/assets/icons/tick.svg?component'

interface CurrentCategory {
  id?: number
  title?: string
}

const { user, userId } = storeToRefs(useUserStore())
const { categories } = storeToRefs(useCategoriesStore())
const { addTask } = useTasksStore()

const newTask = ref('')
const currentCategory = ref<CurrentCategory>({})
const formWarning = ref(false)
const createTask = async () => {
  if (!currentCategory.value.id || !newTask.value) {
    formWarning.value = true
    Swal.fire('Заполните поля', '', 'warning')
  } else if (currentCategory.value.id !== null) {
    addTask(newTask.value, currentCategory.value.id, userId.value)
    newTask.value = ''
  }
}

const showCreateTask = ref(false)
const showSelect = ref(false)

const selectRef = ref(null)
onClickOutside(selectRef, () => (showSelect.value = false))

const setCurrentCategory = (category: Category) => {
  currentCategory.value = {
    id: category.id,
    title: category.title
  }
  showSelect.value = false
}
</script>

<template>
  <div>
    <div class="mb-4 mx-auto">
      <button class="cbtn" @click="showCreateTask = !showCreateTask">
        <div>{{ showCreateTask ? 'закрыть' : 'создать' }}</div>
      </button>
    </div>
    <div>
      <transition-group name="flip">
        <div v-if="showCreateTask" :key="0" class="wrapper">
          <div class="mb-4">
            <input
              v-model="newTask"
              type="text"
              placeholder="название задачи"
              :class="{ form__warning: formWarning }"
              class="remove__invalid"
              required
            />
          </div>
          <div class="mb-4 relative z-0">
            <div
              ref="selectRef"
              class="select"
              :class="{ active: showSelect, form__warning: formWarning }"
              @click="showSelect = !showSelect"
            >
              <div>
                {{ currentCategory.title ?? 'Выберите категорию' }}
              </div>
              <div>
                <TickSVG />
              </div>
            </div>
            <div style="user-select: none">.</div>
            <div v-if="user" class="list" :class="{ active: showSelect }">
              <div
                v-for="category in categories"
                :key="category.id"
                class="li"
                tabindex="0"
                @click="setCurrentCategory(category)"
                @keyup.enter="setCurrentCategory(category)"
              >
                {{ category.title }}
              </div>
            </div>
          </div>
          <div>
            <button class="mbtn mt-3" @click="createTask">добавить</button>
          </div>
        </div>
        <TaskBlock :key="1" />
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="sass">

.select
  position: absolute
  z-index: 100
  position: absolute
  width: 100%
  background: var(--back-main)
  border-radius: 8px
  display: flex
  padding: 4px 10px
  transition: .3s
  cursor: pointer
  align-items: center
  justify-content: space-between
  svg
    width: 10px
    height: 8px
    fill: var(--color)
  &.active
    border-radius: 8px 10px 0 0

.list
  position: absolute
  z-index: 100
  width: 100%
  cursor: pointer
  background: var(--back-main)
  padding: 4px
  border-radius: 0 0 8px 8px
  visibility: hidden
  opacity: 0
  transition: .2s
  .li
    cursor: pointer
    padding: 2px 6px
    border-radius: 8px
    &:hover
      background: var(--back-second)
  &.active
    visibility: visible
    transition: .3s
    opacity: 1

.form__warning
  box-shadow: 0 0 8px 2px #fff
  transition: .3s


.flip-leave-active
  position: absolute
  max-width: 534px
  width: 95%
  opacity: 0
  transition: .4s ease

.flip-enter-active,
.flip-move
  transition: .4s ease

.flip-enter-from,
.flip-leave-to
  opacity: 0
  transition: .3s ease
  transform: scale(0.2)

.remove__invalid
  &:invalid
    box-shadow: none
</style>
