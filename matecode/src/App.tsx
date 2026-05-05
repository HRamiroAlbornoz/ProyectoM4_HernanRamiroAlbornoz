// Componente raíz de la aplicación.
// Acá configuramos el router y envolvemos todo con el AuthProvider.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
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

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Ruta protegida (la protección la agregamos en el Hito 4) */}
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App