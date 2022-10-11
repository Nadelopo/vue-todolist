import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,vue}"',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
})
