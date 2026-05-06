# MateCode — Gestor Estratégico de Tareas

Aplicación web SPA (Single Page Application) desarrollada para que los empleados
de una empresa puedan gestionar sus tareas diarias de forma organizada, persistente
y accesible desde cualquier dispositivo.

## URL de producción

🔗 https://matecode-indol.vercel.app

## Stack tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Backend as a Service:** Firebase (Authentication + Firestore)
- **Envío de emails:** AWS SES via Vercel Serverless Functions
- **Deploy:** Vercel
- **Testing:** Vitest + React Testing Library

## Funcionalidades

- Registro e inicio de sesión con email/contraseña
- Protección de rutas privadas
- Gestión completa de tareas (crear, editar, eliminar, completar)
- Persistencia en la nube por usuario (cada usuario ve solo sus tareas)
- Sincronización en tiempo real sin recargar la página
- Filtros: todas, pendientes, completadas
- Fechas de vencimiento con indicadores visuales
- Drag & drop para reordenar tareas (mouse y pantalla táctil)
- Envío de resumen de tareas por email
- Diseño responsive mobile-first con tema oscuro/claro automático

## Estructura del proyecto

```
src/
├── pages/        → Vistas (LoginPage, RegisterPage, TasksPage)
├── components/   → Componentes UI reutilizables (TaskForm, TaskCard, TaskList)
├── features/     → Lógica por dominio (AuthContext)
├── services/     → Integraciones con Firebase y APIs (authService, taskService, emailService)
├── routes/       → Router y rutas protegidas (ProtectedRoute, PublicRoute)
├── hooks/        → Custom hooks (useAuth, useTasks)
├── types/        → Interfaces TypeScript (Task, TaskFormValues, AuthFormValues)
└── utils/        → Funciones helper (firebaseErrors, dateHelpers)
api/              → Vercel Serverless Functions (send-email.ts)
tests/            → Tests unitarios y de componentes
```

## Decisiones arquitectónicas

**Arquitectura por capas:** Se separaron responsabilidades en capas bien definidas.
Los componentes de UI solo se encargan de renderizar. La lógica de negocio vive
en los custom hooks. Las llamadas a servicios externos están en la capa de servicios.

**Custom hooks:** `useAuth` expone el estado de autenticación a toda la app a través
del `AuthContext`. `useTasks` centraliza toda la lógica del CRUD y la suscripción
en tiempo real con `onSnapshot`, evitando que los componentes conozcan los detalles
de Firestore.

**Seguridad en capas:**
- Las credenciales de Firebase se leen desde variables de entorno con prefijo `VITE_`
- Las credenciales de AWS nunca llegan al frontend: solo existen en la Vercel Function
- Las reglas de Firestore garantizan que cada usuario solo accede a sus propios datos
- El archivo `.env` está excluido del repositorio via `.gitignore`

**Sincronización en tiempo real:** Se usó `onSnapshot` de Firestore en lugar de
consultas simples, permitiendo que la UI se actualice automáticamente ante cualquier
cambio sin necesidad de recargar la página. La suscripción se cancela correctamente
cuando el componente se desmonta para evitar memory leaks.

**AWS SES via Serverless Function:** El envío de emails se realiza exclusivamente
desde una Vercel Function (`api/send-email.ts`). Esto garantiza que las credenciales
de AWS nunca estén expuestas en el navegador del usuario.

## Instalación local

1. Clonar el repositorio:
```bash
git clone https://github.com/HRamiroAlbornoz/ProyectoM4_HernanRamiroAlbornoz.git
cd ProyectoM4_HernanRamiroAlbornoz/matecode
```

2. Instalar dependencias:
```bash
npm install
```

3. Copiar el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Completar el archivo `.env` con los valores reales (ver sección Variables de entorno)

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Firebase - Configuración del proyecto
VITE_FIREBASE_API_KEY=           # Clave de API de Firebase
VITE_FIREBASE_AUTH_DOMAIN=       # Dominio de autenticación (ej: proyecto.firebaseapp.com)
VITE_FIREBASE_PROJECT_ID=        # ID del proyecto Firebase
VITE_FIREBASE_STORAGE_BUCKET=    # Bucket de Storage (ej: proyecto.appspot.com)
VITE_FIREBASE_MESSAGING_SENDER_ID= # ID del remitente de mensajes
VITE_FIREBASE_APP_ID=            # ID de la aplicación Firebase

# AWS SES - Solo para la Vercel Function (sin prefijo VITE_)
AWS_ACCESS_KEY_ID=               # Access Key ID de AWS IAM
AWS_SECRET_ACCESS_KEY=           # Secret Access Key de AWS IAM
AWS_REGION=                      # Región de AWS (ej: us-east-1)
AWS_SES_FROM_EMAIL=              # Email verificado en AWS SES para enviar
```

> ⚠️ Las variables con prefijo `VITE_` son accesibles desde el navegador.
> Las variables sin prefijo (`AWS_*`) solo son accesibles desde las Vercel Functions.
> Nunca subir el archivo `.env` al repositorio.

## Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye el proyecto para producción
npm run preview  # Previsualiza el build de producción
npm run test     # Ejecuta los tests con Vitest
```

## Flujo de envío de emails

El envío del resumen de tareas sigue este flujo para mantener las credenciales
de AWS seguras:

```
Usuario hace clic en "Enviar resumen"
↓
Frontend llama a /api/send-email (POST)
con { to: email_usuario, tasks: [...] }
↓
Vercel Function (api/send-email.ts) recibe la petición
↓
La función lee las credenciales AWS desde variables de entorno del servidor
↓
La función llama a AWS SES con el SDK de Node.js
↓
AWS SES envía el email al usuario
↓
La función responde { success: true } al frontend
↓
El frontend muestra el estado: "✅ ¡Enviado!" o "❌ Error al enviar"
```

El email contiene un resumen HTML con las tareas pendientes y completadas,
incluyendo título y descripción de cada una.

> ⚠️ AWS SES en modo sandbox solo permite enviar a emails verificados.
> Para envío a cualquier email se requiere salir del modo sandbox.

## Testing

El proyecto incluye 26 tests organizados en 4 archivos:

```bash
npm run test -- --run
```

- `tests/utils/firebaseErrors.test.ts` → Tests unitarios del traductor de errores
- `tests/utils/dateHelpers.test.ts` → Tests unitarios de funciones de fechas
- `tests/components/TaskForm.test.tsx` → Tests del formulario de tareas
- `tests/components/TaskCard.test.tsx` → Tests de la tarjeta de tarea

Los servicios externos (Firebase, dnd-kit) están mockeados para que
los tests no realicen llamadas reales.

## Limitaciones conocidas

El login con Google en producción requiere configurar el `authDomain` de Firebase
para que apunte al dominio de Vercel, junto con un proxy en `vercel.json` que
redirige las llamadas de `/__/auth/handler` al handler de Firebase. Esta configuración
evita conflictos de cross-origin entre `vercel.app` y `firebaseapp.com`.
Sin esta configuración, el login con Google funciona correctamente en desarrollo pero falla en producción.

## Uso de IA en el desarrollo

Durante el desarrollo de este proyecto utilicé **Claude (Anthropic)** como
asistente de desarrollo. A continuación detallo cómo lo integré y qué aprendí.

### Situaciones donde fue más efectivo

**Análisis previo al código:** Antes de escribir cualquier línea, le compartí
el enunciado completo y pedí un análisis detallado. Esto me ayudó a entender
la arquitectura global del proyecto y las dependencias entre hitos antes de
empezar. Aprendí que planificar antes de codear evita errores costosos.

**Explicación de conceptos nuevos:** Cuando encontraba tecnologías que no había
usado antes (Firebase Auth, `onSnapshot`, AWS SES, dnd-kit), pedí explicaciones
con analogías simples antes de ver el código. Esto me permitió entender el
*por qué* de cada decisión, no solo copiar el *cómo*.

**Resolución de errores paso a paso:** Ante errores de TypeScript o configuración,
compartí capturas de pantalla y pedí que me explicaran la causa antes de la
solución. Esto me ayudó a reconocer patrones de error y resolverlos solo en
el futuro.

**Escritura de tests:** Pedí que los tests se escribieran explicando qué probaba
cada uno y por qué. Aprendí la diferencia entre testear comportamiento vs
testear implementación, y cómo usar mocks para aislar componentes.

### Patrones de uso que descubrí

- **"Primero el análisis, después el código":** Pedir análisis del enunciado
  antes de cualquier implementación evitó tener que reescribir código.
- **"Explicame el error antes de darme la solución":** Entender la causa de
  un error es más valioso que copiar la solución.
- **"Código simple con comentarios":** Siempre pedí el código más sencillo
  posible con comentarios que explicaran cada decisión.
- **"Verificación antes de avanzar":** Después de cada hito, verificar que
  todo funciona antes de continuar evitó acumular errores.

### Comprensión del código implementado

Todo el código fue revisado y comprendido antes de ser implementado. Cuando
algo no quedaba claro, pedí re-explicaciones con ejemplos más simples. Las
decisiones técnicas (como usar `onSnapshot` vs consultas simples, o
`signInWithRedirect` vs `signInWithPopup`) fueron tomadas con criterio
propio después de entender las ventajas y desventajas de cada opción.

## Autor

**Hernán Ramiro Albornoz**

🔗 [Repositorio en GitHub](https://github.com/HRamiroAlbornoz/ProyectoM4_HernanRamiroAlbornoz)

Proyecto Integrador 4 — Henry Bootcamp

---

## Licencia

Este proyecto es de uso educativo.

---

*© 2026 Hernán Ramiro Albornoz*