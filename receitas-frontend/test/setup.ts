import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { Plugin } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'


const vuetify: Plugin = createVuetify({ components, directives })


config.global.plugins = [vuetify]


beforeEach(() => {
  setActivePinia(createPinia())
})


globalThis.jest = vi
globalThis.afterEach = vi.afterEach
globalThis.beforeEach = vi.beforeEach