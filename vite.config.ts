import { defineConfig } from 'vitest/config';

// Base path for GitHub Pages project site: https://zerlowin.github.io/pascaline/
export default defineConfig({
  base: '/pascaline/',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
