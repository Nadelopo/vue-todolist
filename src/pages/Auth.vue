<script setup lang="ts">
import { supabase } from '@/supabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const change = ref(true)
const router = useRouter()

const signUp = async () => {
  const { user, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) {
    console.log(error)
  }
  if (user) {
    await supabase
      .from('Users')
      .insert([{ id: user.id, email: email.value }])
      .single()
    router.push({ name: 'Home' })
  }
}

const signIn = async () => {
  const { error } = await supabase.auth.signIn({
    email: email.value,
    password: password.value,
  })
  if (error) {
    console.log(error)
  } else router.push({ name: 'Home' })
}

const choiceAuth = () => (change.value ? signIn() : signUp())
</script>

<template>
  <div class="main">
    <div class="login__wrapper">
      <div class="flex justify-between">
        <div>
          <button class="mbtn mb-6" @click="change = true">войти</button>
        </div>
        <div>
          <button class="mbtn" @click="change = false">
            зарегестрироваться
          </button>
        </div>
      </div>
      <form @submit.prevent="choiceAuth">
        <div class="mb-4">
          <input
            type="email"
            class=""
            ref="loginRef"
            placeholder="почта"
            v-model="email"
            required
          />
        </div>
        <div class="mb-6">
          <input
            type="password"
            class=""
            placeholder="пароль"
            v-model="password"
            required
          />
        </div>
        <div>
          <button class="mbtn">
            {{ change ? 'войти' : 'зарегестрироваться' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="sass">

.main
  height: 100vh
  display: flex
  justify-content: center
  align-items: center

.login__wrapper
  width: 100%
  max-width: 280px
  background: var(--back-second)
  border-radius: 8px
  padding: 20px 20px
</style>
