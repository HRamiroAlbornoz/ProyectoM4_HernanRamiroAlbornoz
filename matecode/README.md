# MateCode — Gestor Estratégico de Tareas

Aplicación web SPA para gestionar tareas diarias de forma organizada,
persistente y accesible desde cualquier dispositivo.

## Stack tecnológico

- **Frontend:** React + TypeScript
- **BaaS:** Firebase (Auth + Firestore)
- **Emails:** AWS SES via Vercel Functions
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

## Estructura del proyecto

```
src/
├─ pages/        → Vistas (Login, Register, Tasks)
├─ components/   → Componentes UI reutilizables
├─ features/     → Lógica por dominio (auth, tasks)
├─ services/     → Integraciones con Firebase y APIs
├─ routes/       → Router y rutas protegidas
├─ hooks/        → Custom hooks (useAuth, useTasks)
├─ types/        → Interfaces TypeScript
└─ utils/        → Funciones helper
functions/       → Vercel Functions (envío de emails)
tests/           → Tests unitarios y de componentes
```

## Instalación local

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` a `.env` y completar las variables
4. Iniciar el servidor de desarrollo: `npm run dev`

## Variables de entorno

Ver `.env.example` para la lista completa de variables necesarias.

## Scripts disponibles

- `npm run dev` → Inicia el servidor de desarrollo
- `npm run build` → Construye el proyecto para producción
- `npm run test` → Corre los tests

## URL de producción

_Pendiente de deploy en Vercel_

## Decisiones arquitectónicas

- Arquitectura por capas para separar responsabilidades
- Custom hooks para aislar la lógica de negocio de la UI
- Firestore con reglas de seguridad por userId
- AWS SES invocado exclusivamente desde Vercel Functions
  para no exponer credenciales en el frontend

## Uso de IA en el desarrollo

_Se completará al finalizar el proyecto_