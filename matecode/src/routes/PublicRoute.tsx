// Este componente "envuelve" las rutas públicas (login y register).
// Si el usuario ya está logueado, lo redirige a las tareas.
// Evita que un usuario logueado pueda volver a la pantalla de login.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface PublicRouteProps {
    children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
    const { user, loading } = useAuth()

    // Igual que en ProtectedRoute, esperamos a que Firebase
    // termine de verificar el estado de la sesión
    if (loading) {
        return null
    }

    // Si ya hay un usuario logueado, lo mandamos a las tareas
    if (user) {
        return <Navigate to="/tasks" replace />
    }

    // Si no hay usuario, mostramos el contenido (login o register)
    return <>{children}</>
}