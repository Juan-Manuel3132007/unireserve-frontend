import { expect, test } from '@playwright/test'

import { ADMIN, iniciarSesion } from './helpers'

test.describe('Autenticacion', () => {
  test('la pagina de inicio carga y lleva al login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: /ya tengo cuenta/i }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('el administrador inicia sesion y ve el panel', async ({ page }) => {
    await iniciarSesion(page, ADMIN.correo, ADMIN.password)
    await expect(page.getByRole('heading', { name: /hola/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Gestionar espacios' })).toBeVisible()
  })

  test('una contrasena incorrecta muestra un error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Correo institucional').fill(ADMIN.correo)
    await page.getByLabel('Contrasena').fill('ClaveIncorrecta1!')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('un usuario nuevo se registra y entra al panel', async ({ page }) => {
    const correo = `e2e.${Date.now()}@unireserve.com`
    await page.goto('/registro')
    await page.getByLabel('Nombre', { exact: true }).fill('Prueba')
    await page.getByLabel('Apellido').fill('Playwright')
    await page.getByLabel('Correo', { exact: true }).fill(correo)
    await page.getByLabel('Contrasena', { exact: true }).fill('Prueba123!')
    await page.getByLabel('Confirmar contrasena').fill('Prueba123!')
    await page.getByRole('button', { name: /crear cuenta/i }).click()
    await expect(page).toHaveURL(/\/app$/)
  })

  test('una ruta protegida redirige al login sin sesion', async ({ page }) => {
    await page.goto('/app/mis-reservas')
    await expect(page).toHaveURL(/\/login$/)
  })
})