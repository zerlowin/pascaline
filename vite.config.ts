import { defineConfig } from 'vitest/config';

// Base path for GitHub Pages project site: https://zerlowin.github.io/pascaline/
export default defineConfig({
  base: '/pascaline/',
  build: {
    outDir: 'dist',
    target: 'es2020',
    // Three.js is one ~560 kB chunk; that's expected for a 3D app.
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
