<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/db/supabase'
import Settings from '@/components/Settings.vue'
import SettingSvg from '@/assets/icons/settings.svg?component'

const router = useRouter()

const signOut = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'Auth' })
}

const showSettings = ref(false)
const setShowSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<template>
  <div
    v-if="$route.name !== 'Auth'"
    class="mb-8 pt-10"
  >
    <div class="container">
      <nav>
        <div>
          <button
            class="cbtn"
            @click="signOut"
          >
            выйти
          </button>
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
        <setting-svg @click="setShowSettings" />
      </nav>
    </div>
  </div>
  <Teleport to="body">
    <Transition name="settings">
      <Settings
        v-if="showSettings"
        @close="setShowSettings"
      />
    </Transition>
  </Teleport>
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

nav
  display: flex
  gap: 10px


.settings-enter-active,
.settings-leave-active
  transition: opacity 0.4s ease


.settings-enter-from,
.settings-leave-to
  opacity: 0
</style>
