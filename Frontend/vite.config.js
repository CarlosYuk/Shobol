import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: '../docs', // Esto hará que el build salga en la carpeta docs en la raíz del repo
    emptyOutDir: true,
  },
});