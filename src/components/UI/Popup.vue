<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import { onClickOutside } from '@vueuse/core'

defineProps({
  id: {
    type: Number,
    required: true
  },
  deleteHandler: {
    type: Function as PropType<(id: number) => Promise<void>>,
    required: true
  },
  change: {
    type: Function as PropType<(id: number, title: string) => void>,
    default: () => null
  },
  title: {
    type: String,
    default: ''
  }
})

const showPopup = ref(false)
const popupRef = ref<HTMLDivElement>()
onClickOutside(popupRef, () => (showPopup.value = false))

const changePosition = ref(false)

watch(showPopup, () => {
  if (showPopup.value) changePosition.value = true
  setTimeout(() => {
    if (!showPopup.value) changePosition.value = false
  }, 100)
})
</script>

<template>
  <div class="flex flex-column" :class="{ relative: changePosition }">
    <div class="popup" :class="{ active: showPopup }">
      <button class="cbtn" @click="deleteHandler(id)">удалить</button>
      <button v-if="change" class="cbtn" @click="change(id, title)">
        изменить
      </button>
    </div>
    <div class="dots__wrapper">
      <div
        ref="popupRef"
        class="flex flex-col gap-y-0.5 items-center w-4 cursor-pointer"
        @click="showPopup = !showPopup"
      >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.popup
  position: absolute
  border: 2px solid var(--back-main)
  border-radius: 8px
  background: var(--back-second)
  right: 20px
  top: 0
  visibility: hidden
  opacity: 0
  transition: .1s
  transform: scale(0)
  &.active
    opacity: 1
    visibility: visible
    transform: scale(1)


.dot
  border: 2px solid var(--color)
  color: black
  border-radius: 50px

.dots__wrapper
  display: flex
  align-items: center
  border-radius: 4px
  transition: .4s
</style>
