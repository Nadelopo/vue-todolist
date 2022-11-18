<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import SettingSVG from '@/assets/icons/settings.svg?component'
import Settings from '@/components/Settings.vue'

const router = useRouter()

const signOut = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'Auth' })
}

const isOpenSettings = ref(false)
const setIsOpenSettings = () => {
  isOpenSettings.value = !isOpenSettings.value
}
</script>

<template>
  <div v-if="$route.name !== 'Auth'" class="mb-8 pt-10">
    <div class="container">
      <div class="header">
        <div>
          <button class="cbtn" @click="signOut">выйти</button>
        </div>
        <div>
          <router-link :to="{ name: 'Profile' }">
            <button class="cbtn">профиль</button>
          </router-link>
        </div>
        <div>
          <router-link :to="{ name: 'Home' }">
            <button class="cbtn">задачи</button>
          </router-link>
        </div>

        <SettingSVG @click="setIsOpenSettings" />
      </div>
    </div>
  </div>
  <transition name="settings">
    <Settings v-if="isOpenSettings" :set-open-settings="setIsOpenSettings" />
  </transition>
</template>

<style scoped lang="sass">
.theme, .settings
  margin-left: auto
  cursor: pointer
  height: 22px
  width: 20px
  transition: .3s
  fill: var(--color)
  &:hover
    transform: rotate(180deg) scale(1.1)

.header
  display: flex
  gap: 10px


.settings-enter-active,
.settings-leave-active
  transition: opacity 0.4s ease


.settings-enter-from,
.settings-leave-to
  opacity: 0
</style>
