import { ref } from 'vue'

const setToLocalStorage = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

export const useTheme = () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const setTheme = (value: string) => {
    theme.value = value
    setToLocalStorage(value)
  }
  setToLocalStorage(theme.value)
  return { theme, setTheme }
}
