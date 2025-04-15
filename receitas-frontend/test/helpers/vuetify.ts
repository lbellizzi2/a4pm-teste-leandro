/* eslint-disable @typescript-eslint/no-explicit-any */
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { VuetifyOptions } from 'vuetify'
import { mount } from '@vue/test-utils'

export function withVuetify(options: VuetifyOptions = {}) {
  return {
    global: {
      plugins: [createVuetify({ 
        components, 
        directives,
        ...options 
      })]
    }
  }
}

export function renderWithVuetify(
  component: any,
  options: {
    props?: Record<string, any>
    slots?: Record<string, any>
    vuetifyOptions?: VuetifyOptions
  } = {}
) {
  const { props = {}, slots = {}, vuetifyOptions = {} } = options

  return mount(component, {
    props,
    slots,
    global: {
      ...withVuetify(vuetifyOptions).global,
    },
  })
}