<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

type Children = {
  element: HTMLElement
  height: number
}

type Props = {
  visible: boolean
  paddingTop?: number
  paddingBottom?: number
  transition?: number
}

const props = withDefaults(defineProps<Props>(), {
  paddingTop: 5,
  paddingBottom: 5,
  transition: 0.3
})

const parent = ref()
const childrens = ref<Children[]>([])

onMounted(() => {
  childrens.value = [...parent.value.children].map((el) => {
    return { element: el, height: el.scrollHeight }
  })
})

watch(
  () => props.visible,
  (cur) => {
    childrens.value.forEach((element) => {
      const el = element.element
      if (cur) {
        const height = element.height + props.paddingTop + props.paddingBottom
        el.style.cssText = `
          padding-bottom: ${props.paddingBottom}px;
          padding-top: ${props.paddingTop}px;
          height:  ${height}px;
        `
      } else {
        el.style.cssText = ``
      }
    })
  }
)

const transition = props.transition + 's'
</script>

<template>
  <div
    ref="parent"
    class="accordion__daskk231fas2"
    :class="{ active: visible }"
  >
    <slot />
  </div>
</template>

<style scoped lang="sass">

.accordion__daskk231fas2
  visibility: hidden
  opacity: 0
  transition: v-bind(transition)
  :slotted(div, button, a)
    display: block
    transition: v-bind(transition)
    height: 0px
  &.active
    visibility: visible
    opacity: 1
</style>
