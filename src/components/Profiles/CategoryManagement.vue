<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useUserStore } from '@/stores/userStore'
import Popup from '@/components/UI/Popup.vue'

const { userId } = storeToRefs(useUserStore())
const { categories } = storeToRefs(useCategoriesStore())
const { createCategory, deleteCategory, updateCategory } = useCategoriesStore()

const openInput = ref(false)
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

const newCategory = ref('')

const cancel = () => {
  changeStateCategory.value = false
  openInput.value = false
  newCategory.value = ''
  changeCategory.value = ''
}

const save = async () => {
  if (newCategory.value || changeCategory.value) {
    if (changeStateCategory.value) {
      updateCategory(changeCategory.value, currentCategoryId.value)
    } else if (openInput.value) {
      createCategory(newCategory.value, userId.value)
    }
    cancel()
  } else {
    Swal.fire('Заполните данные', '', 'warning')
  }
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
      <div v-if="!openInput && !changeStateCategory">
        <button class="mbtn mt-6" @click="openAddCategory">
          добавить категорию
        </button>
      </div>
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
