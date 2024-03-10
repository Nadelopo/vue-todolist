<script setup lang="ts">
import { ref } from 'vue'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useUserStore } from '@/stores/userStore'
import Popup from '@/components/UI/Popup.vue'
import { useToast } from 'vue-toastification'

const { user } = useUserStore()
const { categories } = useCategoriesStore()
const { createCategory, deleteCategory, updateCategory } = useCategoriesStore()

const showActionBlock = ref(false)
const changeCategoryTitle = ref('')
const currentCategoryId = ref(0)
const typeAction = ref<'change' | 'create' | null>(null)

const change = (id: number, title: string) => {
  typeAction.value = 'change'
  showActionBlock.value = true
  changeCategoryTitle.value = title
  currentCategoryId.value = id
}

const openCategoryActions = () => {
  typeAction.value = 'create'
  showActionBlock.value = true
}

const newCategoryTitle = ref('')
const cancel = () => {
  typeAction.value = null
  showActionBlock.value = false
  newCategoryTitle.value = ''
  changeCategoryTitle.value = ''
}

const toast = useToast()
const save = async () => {
  if (!user.value) return
  if (typeAction.value === 'change') {
    if (!changeCategoryTitle.value) {
      toast.warning('Заполните данные')
      return
    }
    await updateCategory(changeCategoryTitle.value, currentCategoryId.value)
  }
  if (typeAction.value === 'create') {
    if (!newCategoryTitle.value) {
      toast.warning('Заполните данные')
      return
    }
    await createCategory(newCategoryTitle.value, user.value.id)
  }
  cancel()
}
</script>

<template>
  <div>
    <div class="font-medium text-lg mb-4">Управление категориями</div>
    <div class="wrapper">
      <div
        v-if="categories"
        class="flex flex-col gap-y-4"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="category"
        >
          <div class="shadow__none">{{ category.title }}</div>
          <Popup
            :id="category.id"
            :title="category.title"
            @delete="deleteCategory"
            @change="change"
          />
        </div>
      </div>
      <div v-if="showActionBlock">
        <div>
          <input
            v-if="typeAction === 'create'"
            v-model="newCategoryTitle"
            type="text"
            class="mt-6"
          />
          <input
            v-else-if="typeAction === 'change'"
            v-model="changeCategoryTitle"
            type="text"
            class="mt-6"
          />
        </div>
        <div>
          <button
            class="mbtn mt-4"
            @click="cancel"
          >
            отменить
          </button>
        </div>
      </div>
      <div v-else>
        <button
          class="mbtn mt-6"
          @click="openCategoryActions"
        >
          добавить категорию
        </button>
      </div>
      <button
        class="mbtn mt-6"
        @click="save"
      >
        сохранить
      </button>
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
