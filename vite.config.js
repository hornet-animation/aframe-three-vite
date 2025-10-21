import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/aframe-three-vite/', // 👈 match your GitHub repo name
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ar: resolve(__dirname, 'ar.html'),
      },
    },
  },
})
