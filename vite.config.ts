/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario para que funcione dentro de un contenedor Docker
    port: 5173,
  },
  preview: { host: true, port: 4173 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    // Vitest solo corre las pruebas unitarias de src/.
    // Las pruebas de e2e/ son de Playwright y se corren con "npm run test:e2e".
    include: ['src/**/*.test.{ts,tsx}'],
  },
})