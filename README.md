# UniReserve Frontend (SPA React)

[![Frontend CI](https://github.com/Juan-Manuel3132007/unireserve-frontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Juan-Manuel3132007/unireserve-frontend/actions/workflows/frontend-ci.yml)

Interfaz de usuario web (Single Page Application) de **UniReserve** desarrollada con React 18, Vite 5, TypeScript y TailwindCSS/CSS Modules, empaquetada y servida con Nginx Alpine.

---

## 🛠️ Tecnologías

- **Node.js**: 22 LTS
- **Framework**: React 18.3 + TypeScript 5.7
- **Bundler**: Vite 5.4
- **Testing Unitario/Componentes**: Vitest 2.1 + Testing Library + jsdom
- **Testing E2E**: Playwright 1.49 (Chromium)
- **Linter**: ESLint 8.57 con plugins para TypeScript y React Hooks
- **Servidor Web**: Nginx 1.27 Alpine

---

## ⚙️ Variables de Entorno

| Variable | Momento de Inyección | Valor por defecto | Descripción |
|---|---|---|---|
| `VITE_API_URL` | **Compilación (`npm run build`)** | `http://localhost:8000` | URL base de la API REST del backend |
| `E2E_BASE_URL` | Ejecución E2E Playwright | `http://localhost:3000` | URL del frontend a testear |
| `E2E_API_URL` | Ejecución E2E Playwright | `http://localhost:8000` | URL de la API para llamadas auxiliares en E2E |

> **Nota técnica**: Al tratarse de una SPA construida con Vite, `VITE_API_URL` se incrusta en los bundles estáticos en tiempo de build mediante `ARG VITE_API_URL` en el Dockerfile.

---

## 🧪 Comandos de Desarrollo y Pruebas

```bash
# Instalar dependencias exactas
npm ci

# Ejecutar linter
npm run lint

# Ejecutar pruebas unitarias de componentes con Vitest
npm run test

# Compilación de producción (TypeScript check + Vite build)
npm run build
```

---

## 🎭 Pruebas End-to-End (E2E con Playwright)

Las pruebas E2E validan los flujos completos de autenticación, visualización de espacios y reserva.

### Ejecución contra Docker Compose o Minikube
```bash
# Configurar URLs dinámicamente si los puertos cambian
$env:E2E_BASE_URL="http://localhost:3000"
$env:E2E_API_URL="http://localhost:8000"

# Ejecutar la suite E2E
npx playwright test
```

---

## 🐳 Construcción y Ejecución de la Imagen Docker

La imagen del frontend utiliza multi-stage build: una etapa de Node 22 compila la aplicación y una etapa final Nginx 1.27 sirve los archivos estáticos:

```bash
# Construir imagen inyectando la URL de la API
docker build --build-arg VITE_API_URL=http://localhost:8000 -t juanma313/unireserve-frontend:v1.0.0 .

# Ejecutar contenedor en el puerto 3000
docker run -d -p 3000:80 juanma313/unireserve-frontend:v1.0.0
```

---

## 🔄 CI/CD Automatizado

El workflow `.github/workflows/frontend-ci.yml` ejecuta:
1. `npm ci` con caché nativo de dependencias.
2. `npm run lint` validando reglas de TypeScript y Hooks.
3. `npm run test` con Vitest.
4. `npm run build` verificando consistencia de tipos y empaquetado.
5. Construcción de verificación de imagen Docker.
6. Publicación segura a DockerHub (`juanma313/unireserve-frontend`) con etiquetas OCI (`sha-<hash>`, semver y `latest`) cuando se ejecuta en la rama `main` o tags `v*`.
