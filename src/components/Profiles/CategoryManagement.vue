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
const { addCategory, deleteFromCategories, updateCategory } =
  useCategoriesStore()

const changeCategory = ref('')
const currentCategoryId = ref(0)
const changeStateCategory = ref(false)
const change = (id: number, title: string) => {
  changeStateCategory.value = true
  openInput.value = false
  changeCategory.value = title
  currentCategoryId.value = id
}

const openAddCategory = () => {
  changeStateCategory.value = false
  openInput.value = true
}

const cancel = () => {
  changeStateCategory.value = false
  openInput.value = false
  newCategory.value = ''
  changeCategory.value = ''
}

const deleteCategory = async (categoryId: number) => {
  const { data, error } = await supabase
    .from('Categories')
    .delete()
    .eq('id', categoryId)
  if (data) {
    deleteFromCategories(data[0].id)
  }
  if (error) {
    console.log(error)
  }
}

const save = async () => {
  if (changeStateCategory.value) {
    const { data, error } = await supabase
      .from<TCategory>('Categories')
      .update({ title: changeCategory.value })
      .eq('id', currentCategoryId.value)
    if (data) {
      updateCategory(data[0])
    }
    if (error) {
      console.log(error)
    }
  } else if (openInput.value) {
    const { data, error } = await supabase
      .from<TCategory>('Categories')
      .insert({ title: newCategory.value, userId: userId.value })
    if (data) {
      addCategory(data[0])
    }
    if (error) {
      console.log(error)
    }
  }
  cancel()
}
</script>

<template>
  <div>
    <div class="font-medium text-lg mb-4">Управление категориями</div>
    <div class="wrapper">
      <div v-if="categories" class="flex flex-col gap-y-4">
        <div v-for="category in categories" :key="category.id" class="category">
          <div class="shadow__none">{{ category.title }}</div>
          <Popup
            :id="category.id"
            :delete-handler="deleteCategory"
            :change="change"
            :title="category.title"
          />
        </div>
      </div>
      <div v-if="openInput">
        <input v-model="newCategory" type="text" class="mt-6" />
      </div>
      <button
        v-if="!openInput && !changeStateCategory"
        class="mbtn mt-6"
        @click="openAddCategory"
      >
        добавить категорию
      </button>
      <div v-if="changeStateCategory">
        <input v-model="changeCategory" type="text" class="mt-6" />
      </div>

      <div v-if="openInput || changeStateCategory">
        <button class="mbtn mt-4" @click="cancel">отменить</button>
      </div>
      <button class="mbtn mt-6" @click="save">сохранить</button>
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
