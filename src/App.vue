<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from './db/supabase'
import { useUserStore } from './stores/userStore'
import { useCategoriesStore } from './stores/categoriesStore'
import { useTheme } from './utils/theme'

const { setUserData } = useUserStore()
const { setCategories } = useCategoriesStore()

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    const id = session?.user?.id
    setUserData(id)
    setCategories(id)
    eventValue.value = event
  }
})

useTheme()
</script>

<template>
  <router-view />
</template>
