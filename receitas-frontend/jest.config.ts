// filepath: d:\projetos\a4pm-teste\receitas-frontend\jest.config.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest'
import { compilerOptions } from './server/tsconfig.json';

/** @type {import('jest').Config} */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vuetify/components$': 'vuetify/components/index.mjs',
    '^vuetify/directives$': 'vuetify/directives/index.mjs',
  },
  testMatch: ['<rootDir>/test/**/*.spec.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag: any) => tag.startsWith('v-'),
      },
    },
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

module.exports = config;