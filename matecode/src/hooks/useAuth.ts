// Un custom hook es una función que empieza con "use" y nos permite
// reutilizar lógica entre componentes.
// Este hook nos da acceso fácil al usuario autenticado.

import { useContext } from 'react'
import { AuthContext } from '../features/auth/AuthContext'

export function useAuth() {
    return useContext(AuthContext)
}