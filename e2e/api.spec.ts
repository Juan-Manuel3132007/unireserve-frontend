import { expect, test } from '@playwright/test'

import { API_URL } from './helpers'

test.describe('API backend', () => {
  test('health check responde ok', async ({ request }) => {
    const res = await request.get(`${API_URL}/health`)
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).status).toBe('ok')
  })

  test('readiness confirma la conexion con PostgreSQL', async ({ request }) => {
    const res = await request.get(`${API_URL}/health/ready`)
    expect(res.ok()).toBeTruthy()
  })

  test('Swagger (OpenAPI) esta publicado', async ({ request }) => {
    const docs = await request.get(`${API_URL}/docs`)
    expect(docs.ok()).toBeTruthy()
    const openapi = await request.get(`${API_URL}/openapi.json`)
    expect((await openapi.json()).info.title).toBe('UniReserve API')
  })
})