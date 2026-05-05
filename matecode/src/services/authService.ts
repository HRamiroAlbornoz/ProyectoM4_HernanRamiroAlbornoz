// Este archivo contiene todas las funciones de autenticación.
// Separamos la lógica de Firebase de los componentes de React
// para que el código sea más fácil de entender y testear.

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth'
import { auth } from './firebase'

// Creamos el proveedor de Google una sola vez y lo reutilizamos
const googleProvider = new GoogleAuthProvider()

// Registra un usuario nuevo con email y contraseña
export async function registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

// Inicia sesión con email y contraseña
export async function loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
}

// Inicia sesión con la cuenta de Google (abre un popup)
export async function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
}

// Cierra la sesión del usuario actual
export async function logout() {
    return signOut(auth)
}