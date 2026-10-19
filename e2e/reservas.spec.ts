import { expect, test } from '@playwright/test'

import { ESTUDIANTE, fechaFuturaAleatoria, iniciarSesion } from './helpers'

test.describe('Reservas (flujo completo frontend -> backend -> base de datos)', () => {
  test('el estudiante ve el catalogo de espacios', async ({ page }) => {
    await iniciarSesion(page, ESTUDIANTE.correo, ESTUDIANTE.password)
    await page.getByRole('link', { name: 'Espacios', exact: true }).click()
    await expect(page.getByText('Sala de estudio 101').first()).toBeVisible()
  })

  test('el estudiante crea una reserva y luego la cancela', async ({ page }) => {
    const motivo = `Prueba E2E ${Date.now()}`
    await iniciarSesion(page, ESTUDIANTE.correo, ESTUDIANTE.password)

    await page.goto('/app/reservar')
    await page.getByLabel('Fecha').fill(fechaFuturaAleatoria())
    await page.getByLabel('Hora de inicio').fill('07:00')
    await page.getByLabel('Hora de finalizacion').fill('08:00')
    await page.getByLabel('Motivo').fill(motivo)
    await page.getByRole('button', { name: /confirmar reserva/i }).click()

    // Tras crearla, la app redirige a "Mis reservas" y la fila viene de la base de datos.
    await expect(page).toHaveURL(/\/app\/mis-reservas$/)
    const fila = page.getByRole('row').filter({ hasText: motivo })
    await expect(fila).toBeVisible()

    // La app pide confirmacion con window.confirm: se acepta el dialogo.
    page.once('dialog', (dialogo) => dialogo.accept())
    await fila.getByRole('button', { name: 'Cancelar' }).click()
    await expect(fila.getByText(/cancelada/i)).toBeVisible()
  })

  test('el backend rechaza una reserva que se cruza con otra', async ({ page }) => {
    const fecha = fechaFuturaAleatoria()
    await iniciarSesion(page, ESTUDIANTE.correo, ESTUDIANTE.password)

    for (const intento of [1, 2]) {
      await page.goto('/app/reservar')
      await page.getByLabel('Fecha').fill(fecha)
      await page.getByLabel('Hora de inicio').fill('09:00')
      await page.getByLabel('Hora de finalizacion').fill('10:00')
      await page.getByLabel('Motivo').fill(`Choque E2E intento ${intento}`)
      await page.getByRole('button', { name: /confirmar reserva/i }).click()
      if (intento === 1) await expect(page).toHaveURL(/\/app\/mis-reservas$/)
    }

    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/app\/reservar/)
  })
})