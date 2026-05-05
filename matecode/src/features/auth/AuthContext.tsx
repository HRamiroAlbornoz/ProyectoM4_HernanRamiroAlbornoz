// El Context de React es como una "variable global" para los componentes.
// En este caso, compartimos el usuario autenticado con toda la app.

import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../../services/firebase'

// Definimos qué datos va a tener el contexto
interface AuthContextType {
    user: User | null      // El usuario logueado (o null si no hay sesión)
    loading: boolean       // true mientras Firebase verifica si hay sesión
}

// Creamos el contexto con valores por defecto
export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})

// El Provider es el componente que "provee" el contexto a sus hijos.
// Vamos a envolver toda la app con este componente.
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // onAuthStateChanged escucha automáticamente cuando el usuario
        // inicia sesión, cierra sesión, o recarga la página.
        // Esto es lo que hace que la sesión sea persistente.
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)   // Guardamos el usuario (o null)
            setLoading(false)       // Ya sabemos el estado, dejamos de cargar
        })

        // Cuando el componente se desmonta, cancelamos el listener
        // para evitar problemas de memoria (memory leak)
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}