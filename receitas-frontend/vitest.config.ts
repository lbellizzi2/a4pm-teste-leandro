import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['components/**/*.{vue,ts}']
    },
    deps: {
      inline: ['vuetify']
    },
    alias: {
      '#app': fileURLToPath(new URL('./node_modules/nuxt/dist/app/index.mjs', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})