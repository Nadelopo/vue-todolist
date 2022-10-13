<script setup lang="ts">
import { ref, watch, type PropType } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Accordion from './UI/Accordion.vue'
import CloseSVG from '@/assets/icons/close.svg?component'

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
        <div ref="contentRef" class="wrapper">
          <div class="flex justify-between mb-2">
            <div>настройки</div>
            <div>
              <CloseSVG @click="setOpenSettings" />
            </div>
          </div>
          <hr />

          <div class="mt-4">
            <div class="cursor-pointer" @click="visible = !visible">
              сменить тему
            </div>
            <Accordion :visible="visible">
              <div class="li" @click="setTheme('dark')">темная</div>
              <div class="li" @click="setTheme('light')">светлая</div>
              <div class="li" @click="setTheme('turquoise')">бирюзовый</div>
              <div class="li" @click="setTheme('purple')">фиолетовый</div>
              <div class="li" @click="setTheme('orange')">ораньжевый</div>
            </Accordion>
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
  z-index: 100

.li
  border-radius: 8px
  cursor: pointer
  padding: 0 10px
  &:hover
    background: var(--back-main)
</style>
