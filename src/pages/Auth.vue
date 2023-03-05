<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { supabase } from '@/supabase'
import { createOne } from '@/utils/queries'
import { useCategoriesStore, type Category } from '@/stores/categoriesStore'
import type { User } from '@/stores/userStore'

const email = ref('')
const password = ref('')
const switchForm = ref(true)
const router = useRouter()

const { setCategories } = useCategoriesStore()

const signUp = async () => {
  const { user, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.log(error)
    let message = 'Непредвиденная ошибка'
    switch (error.status) {
      case 400:
        message = 'Пользователь уже зарегистрирован'
        break
      case 422:
        message = 'Пароль должен состоять не менее чем из 6 символов'
    }
    Swal.fire(message, '', 'error')
  }
  if (user) {
    const data = await createOne<User>('Users', {
      id: user.id,
      email: user.email
    })
    if (data) {
      await createOne<Category>('Categories', {
        title: 'ежедневные',
        userId: user.id
      })
      await setCategories(user.id)
      router.push({ name: 'Home' })
    }
  }
}

const signIn = async () => {
  const { error } = await supabase.auth.signIn({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.log(error)
    Swal.fire('Данные не верны', '', 'error')
  } else router.push({ name: 'Home' })
}
</script>

<template>
  <div class="main">
    <div class="login__wrapper">
      <div class="flex justify-between">
        <div>
          <button class="mbtn mb-6" @click="switchForm = true">войти</button>
        </div>
        <div>
          <button class="mbtn" @click="switchForm = false">
            зарегестрироваться
          </button>
        </div>
      </div>
      <form @submit.prevent="switchForm ? signIn() : signUp()">
        <div class="mb-4">
          <input v-model="email" type="email" placeholder="почта" required />
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
