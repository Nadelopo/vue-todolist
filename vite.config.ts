import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import checker from 'vite-plugin-checker'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

const pwaOptions = {
  base: '/',
  manifest: {
    name: 'todolist',
    short_name: 'todolist',
    theme_color: '#1c1c1c',
    icons: [
      {
        src: 'logo.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: 'logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA(pwaOptions),
    svgLoader(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,vue}"'
      },
      overlay: {
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000
  }
})
