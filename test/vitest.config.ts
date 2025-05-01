/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '..')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['./test/**/*.test.?(c|m)[jt]s?(x)'],
    coverage: {
      all: true,
      include: ['src']
    }
  }
})
