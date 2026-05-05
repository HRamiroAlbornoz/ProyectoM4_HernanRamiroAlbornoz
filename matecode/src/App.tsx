// Componente raíz de la aplicación.
// Acá configuramos el router y envolvemos todo con el AuthProvider.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicRoute } from './routes/PublicRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TasksPage } from './pages/TasksPage'

function App() {
  return (
    // BrowserRouter habilita el sistema de rutas en la app
    <BrowserRouter>
      {/* AuthProvider comparte el estado de autenticación con toda la app */}
      <AuthProvider>
        <Routes>
          {/* Ruta raíz: redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas públicas: solo accesibles sin sesión activa */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Ruta protegida: solo accesible con sesión activa */}
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />

          {/* Cualquier ruta desconocida redirige al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App