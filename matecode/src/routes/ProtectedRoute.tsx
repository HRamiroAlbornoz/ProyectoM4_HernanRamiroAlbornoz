// Este componente "envuelve" las rutas privadas.
// Si el usuario no está autenticado, lo redirige al login.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
    children: React.ReactNode  // El contenido de la ruta privada
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()

    // Mientras Firebase verifica si hay sesión activa, mostramos
    // una pantalla en blanco. Esto evita redirigir al usuario
    // al login por error antes de que Firebase responda.
    if (loading) {
        return null
    }

    // Si no hay usuario logueado, redirigimos al login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Si hay usuario logueado, mostramos el contenido de la ruta
    return <>{children}</>
}