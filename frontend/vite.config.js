import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(new URL('./src', import.meta.url).pathname),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // Use import syntax here for Tailwind and Autoprefixer
    },
  },
});
