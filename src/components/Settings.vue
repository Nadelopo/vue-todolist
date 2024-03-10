<script setup lang="ts">
import { ref } from 'vue'
import Accordion from './UI/Accordion.vue'
import { useTheme } from '@/utils/theme'
import CloseSVG from '@/assets/icons/close.svg?component'

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)

const { setTheme } = useTheme()

const themes = [
  { value: 'dark', title: 'темная' },
  { value: 'light', title: 'светлая' },
  { value: 'turquoise', title: 'бирюзовый' },
  { value: 'purple', title: 'фиолетовый' },
  { value: 'orange', title: 'оранжевый' }
]
</script>

<template>
  <div>
    <div
      class="root"
      @click.stop="emit('close')"
    >
      <div class="container">
        <div
          class="wrapper"
          @click.stop
        >
          <div class="flex justify-between mb-2">
            <div>настройки</div>
            <div>
              <CloseSVG @click="emit('close')" />
            </div>
          </div>
          <hr />

          <div class="mt-4">
            <div
              class="cursor-pointer"
              @click="visible = !visible"
            >
              сменить тему
            </div>
            <Accordion :visible="visible">
              <div
                v-for="theme in themes"
                :key="theme.value"
                class="li"
                @click="setTheme(theme.value)"
              >
                {{ theme.title }}
              </div>
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
