import { expect, type Page } from '@playwright/test'

export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8000'

export const ADMIN = { correo: 'admin@unireserve.com', password: 'Admin123!' }
export const ESTUDIANTE = { correo: 'juan.restrepo@unireserve.com', password: 'Estudiante123!' }

export async function iniciarSesion(page: Page, correo: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Correo institucional').fill(correo)
  await page.getByLabel('Contrasena').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/app$/)
}

/** Fecha futura aleatoria (YYYY-MM-DD) para que las reservas no choquen entre ejecuciones. */
export function fechaFuturaAleatoria(): string {
  const dias = 60 + Math.floor(Math.random() * 300)
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}