import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        share: resolve(rootDir, 'share/index.html'),
        cases: resolve(rootDir, 'cases/index.html'),
        casesManage: resolve(rootDir, 'cases/manage/index.html'),
      },
    },
  },
})
