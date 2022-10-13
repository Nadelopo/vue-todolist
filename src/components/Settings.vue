<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import { onClickOutside } from '@vueuse/core'
// import Accordion from './UI/Accordion.vue'

const props = defineProps({
  setOpenSettings: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const contentRef = ref(null)
onClickOutside(contentRef, () => props.setOpenSettings())

const visible = ref(false)

const theme = ref(localStorage.getItem('theme') || 'dark')
const setTheme = (value: string) => (theme.value = value)
document.documentElement.setAttribute('data-theme', theme.value)

watch(
  () => theme.value,
  (current) => {
    document.documentElement.setAttribute('data-theme', current)
    localStorage.setItem('theme', current)
  }
)
</script>

<template>
  <div>
    <div class="root">
      <div class="container">
        <div class="wrapper" ref="contentRef">
          <div class="flex justify-between mb-2">
            <div>настройки</div>
            <div>
              <svg
                @click="setOpenSettings"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                fill="currentColor"
                class="bi bi-x cursor-pointer"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
          </div>
          <hr />

          <div class="mt-4">
            <div class="cursor-pointer" @click="visible = !visible">
              сменить тему
            </div>
            <!-- <Accordion :visible="visible"> -->
            <div @click="setTheme('dark')" class="li">темная</div>
            <div @click="setTheme('light')" class="li">светлая</div>
            <div @click="setTheme('turquoise')" class="li">бирюзовый</div>
            <div @click="setTheme('purple')" class="li">фиолетовый</div>
            <div @click="setTheme('orange')" class="li">ораньжевый</div>
            <!-- </Accordion> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">

.root
  top: 0
  bottom: 0
  right: 0
  left: 0
  background: rgba(0, 0, 0, 0.5)
  position: fixed
  display: flex
  padding: 40px
  font-size: 18px

.li
  border-radius: 8px
  cursor: pointer
  padding: 0 10px
  &:hover
    background: var(--back-main)
</style>
