<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'
import { useUserStore } from './stores/userStore'
import { supabase } from './supabase'

const { userId, user } = storeToRefs(useUserStore())
const { getUserData } = useUserStore()

onBeforeMount(async () => {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')
    ?.currentSession?.access_token
  if (token) {
    try {
      const resp = await supabase.auth.api.getUser(token)
      if (resp.user) {
        userId.value = resp.user.id
        user.value = await getUserData(resp.user.id)
      }
    } catch (err) {
      console.log(err)
    }
  }
})

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    userId.value = session.user.id
    user.value = await getUserData(userId.value)
  } else {
    userId.value = ''
    user.value = null
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
