import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas end-to-end de UniReserve.
 *
 * Requieren el stack completo corriendo (docker compose up) con el seed cargado:
 *   - Frontend: http://localhost:3000
 *   - Backend:  http://localhost:8000
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})