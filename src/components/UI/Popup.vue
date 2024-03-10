<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutsideClose } from '@/utils/onClickOutsideClose'

const emit = defineEmits<{
  delete: [id: number]
  change: [id: number, title: string]
}>()

defineProps<{ id: number; title: string }>()

const popupRef = ref<HTMLDivElement>()
const show = onClickOutsideClose(popupRef)
</script>

<template>
  <div class="flex flex-column relative">
    <Transition name="popup">
      <div
        v-if="show"
        class="popup"
      >
        <button
          class="cbtn"
          @click="emit('delete', id)"
        >
          удалить
        </button>
        <button
          class="cbtn"
          @click="emit('change', id, title)"
        >
          изменить
        </button>
      </div>
    </Transition>
    <div class="dots__wrapper">
      <div
        ref="popupRef"
        class="flex flex-col gap-y-0.5 items-center w-4 cursor-pointer"
        @click="show = !show"
      >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.popup-enter-active,
.popup-leave-active
  transition: .2s ease
  opacity: 1
  transform: scale(1)


.popup-enter-from,
.popup-leave-to
  opacity: 0
  transform: scale(0)


.popup
  position: absolute
  border: 2px solid var(--back-main)
  border-radius: 8px
  background: var(--back-second)
  right: 20px
  top: 0

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
