/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
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
