<script setup lang="ts">
import { useCategoriesStore, type TCategory } from '@/stores/categoriesStore'
import { useUserStore } from '@/stores/userStore'
import { supabase } from '@/supabase'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Popup from '@/components/UI/Popup.vue'

const openInput = ref(false)
const newCategory = ref('')

const { userId } = storeToRefs(useUserStore())

const { categories } = storeToRefs(useCategoriesStore())

const editCategory = async () => {
  const { error } = await supabase
    .from<TCategory>('Categories')
    .insert({ title: newCategory.value, userId: userId.value })
  if (error) {
    console.log(error)
  }
}

const deleteCategory = async (categoryId: number) => {
  const { error } = await supabase
    .from('Categories')
    .delete()
    .eq('id', categoryId)
  if (error) {
    console.log(error)
  }
}

const changeCategory = ref('')
const changeStateCategory = ref(false)
const change = (id: number, title: string) => {
  changeStateCategory.value = true
  openInput.value = false
  changeCategory.value = title
}

const addCategory = () => {
  changeStateCategory.value = false
  openInput.value = true
}

const cancel = () => {
  changeStateCategory.value = false
  openInput.value = false
}
</script>

<template>
  <div>
    <div class="font-medium text-lg mb-4">Управление категориями</div>
    <div class="wrapper">
      <div class="flex flex-col gap-y-4" v-if="categories">
        <div v-for="category in categories" :key="category.id" class="category">
          <div class="shadow__none">{{ category.title }}</div>
          <Popup
            :delete-handler="deleteCategory"
            :id="category.id"
            :change="change"
            :title="category.title"
          />
        </div>
      </div>
      <div v-if="openInput">
        <input type="text" class="mt-6" v-model="newCategory" />
      </div>
      <button
        class="mbtn mt-6"
        @click="addCategory"
        v-if="!openInput && !changeStateCategory"
      >
        добавить категорию
      </button>
      <div v-if="changeStateCategory">
        <input type="text" class="mt-6" v-model="changeCategory" />
      </div>

      <div v-if="openInput || changeStateCategory">
        <button class="mbtn mt-4" @click="cancel">отменить</button>
      </div>
      <button class="mbtn mt-6" @click="editCategory">сохранить</button>
    </div>
  </div>
</template>

<style scoped lang="sass">

.category
  border-radius: 8px
  padding: 2px 8px
  display: flex
  justify-content: space-between

.shadow__none
  &:focus, &:hover
    box-shadow: none
</style>
