import { defineConfig } from 'vite';

export default defineConfig({
  base: './',      // 👈 rutas relativas, sirven perfecto en GitHub Pages
  build: {
    outDir: 'dist',
  },
});
