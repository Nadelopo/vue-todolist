<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/db/supabase'
import { useToast } from 'vue-toastification'
import { useCategoriesStore } from '@/stores/categoriesStore'

const toast = useToast()

const email = ref('')
const password = ref('')
const switchForm = ref(true)
const router = useRouter()

const { setCategories } = useCategoriesStore()

const signUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.error(error)
    let message = 'Непредвиденная ошибка'
    switch (error.status) {
      case 400:
        message = 'Пользователь уже зарегистрирован'
        break
      case 422:
        message = 'Пароль должен состоять не менее чем из 6 символов'
    }
    toast.error(message)
    return
  }
  if (!data.user) return
  const userResponse = await supabase
    .from('Users')
    .insert({ id: data.user.id, email: data.user.email! })
  if (userResponse.error) return
  await supabase
    .from('Categories')
    .insert({ title: 'ежедневные', userId: data.user.id })
  await setCategories(data.user.id)
  router.push({ name: 'Home' })
}

const signIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.error(error)
    toast.error('Данные не верны')
  } else {
    router.push({ name: 'Home' })
  }
}
</script>

<template>
  <div class="main">
    <div class="login__wrapper">
      <div class="flex justify-between">
        <div>
          <button
            class="mbtn mb-6"
            @click="switchForm = true"
          >
            войти
          </button>
        </div>
        <div>
          <button
            class="mbtn"
            @click="switchForm = false"
          >
            зарегестрироваться
          </button>
        </div>
      </div>
      <form @submit.prevent="switchForm ? signIn() : signUp()">
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="почта"
            required
          />
        </div>
        <div class="mb-6">
          <input
            v-model="password"
            type="password"
            minlength="6"
            placeholder="пароль"
            required
          />
        </div>
        <div>
          <button class="mbtn">
            {{ switchForm ? 'войти' : 'зарегестрироваться' }}
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
