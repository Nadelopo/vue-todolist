<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())
</script>

<template>
  <main>
    <div>{{ user }}</div>
  </main>
</template>
