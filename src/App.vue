<script setup lang="ts">
import { useTasksStore } from '@/stores/tasksStore'
import { storeToRefs } from 'pinia'
import { onBeforeMount, provide, ref } from 'vue'
import { useUserStore } from './stores/userStore'
import { supabase } from './supabase'
import Navbar from '@/components/Navbar.vue'
import { useCategoriesStore } from './stores/categoriesStore'

import { setIsOpenSettingsKey, isOpenSettingsKey } from '@/symbols'

const { userId, user } = storeToRefs(useUserStore())
const { getUserData } = useUserStore()
const { setCategories } = useCategoriesStore()
const { getTasks } = useTasksStore()

onBeforeMount(async () => {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
    ?.currentSession?.access_token
  if (token) {
    try {
      const resp = await supabase.auth.api.getUser(token)
      if (resp.user) {
        userId.value = resp.user.id
        user.value = await getUserData(resp.user.id)
        setCategories(resp.user.id)
        getTasks(resp.user.id)
      }
    } catch (err) {
      console.log(err)
    }
  }
})

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    userId.value = session.user.id
    user.value = await getUserData(session.user.id)
    setCategories(session.user.id)
    getTasks(session.user.id)
  } else {
    userId.value = ''
    user.value = null
  }
})

const isOpenSettings = ref(false)
provide(isOpenSettingsKey, isOpenSettings)

const setIsOpenSettings = () => {
  isOpenSettings.value = !isOpenSettings.value
}
provide(setIsOpenSettingsKey, setIsOpenSettings)
</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
