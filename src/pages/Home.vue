<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { supabase } from '@/supabase'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  console.log(error)
}
</script>

<template>
  <main>
    <div>{{ user }}</div>
    <div><router-link to="/auth" @click="signOut">выйти</router-link></div>
  </main>
</template>
