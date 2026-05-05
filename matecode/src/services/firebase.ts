// Este archivo inicializa Firebase y exporta los servicios
// que vamos a usar en toda la aplicación (Auth y Firestore).

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Leemos las credenciales desde las variables de entorno.
// El prefijo VITE_ es obligatorio para que Vite las exponga al frontend.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Inicializamos la app de Firebase con la configuración
const app = initializeApp(firebaseConfig)

// Exportamos Auth (para el login/registro)
export const auth = getAuth(app)

// Exportamos Firestore (para guardar las tareas)
export const db = getFirestore(app)