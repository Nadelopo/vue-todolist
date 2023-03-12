import { ref, watch } from 'vue'

const setToLocaleStorage = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

export const useTheme = () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const setTheme = (value: string) => (theme.value = value)
  setToLocaleStorage(theme.value)
  watch(theme, (current) => setToLocaleStorage(current))
  return { theme, setTheme }
}
