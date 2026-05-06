// Página de inicio de sesión.
// Permite al usuario ingresar con email/password o con Google.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithEmail, loginWithGoogle } from '../services/authService'
import { getAuthErrorMessage } from '../utils/firebaseErrors'
import styles from './AuthPages.module.css'

export function LoginPage() {
    // Estado del formulario
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // useNavigate nos permite redirigir al usuario a otra página
    const navigate = useNavigate()

    // Se ejecuta cuando el usuario envía el formulario
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()  // Evita que la página se recargue
        setError('')         // Limpiamos errores anteriores
        setLoading(true)

        try {
            await loginWithEmail(email, password)
            navigate('/tasks')  // Si el login fue exitoso, vamos a las tareas
        } catch (err: unknown) {
            // Firebase devuelve un objeto con un código de error
            const code = (err as { code?: string }).code ?? ''
            setError(getAuthErrorMessage(code))
        } finally {
            setLoading(false)
        }
    }

    // Se ejecuta cuando el usuario hace clic en "Continuar con Google"
    async function handleGoogle() {
        setError('')
        setLoading(true)

        try {
            await loginWithGoogle()
            navigate('/tasks')
        } catch (err: unknown) {
            // 👇 Agregamos esto temporalmente para ver el error exacto
            console.log('Error completo:', err)
            console.log('Código de error:', (err as { code?: string }).code)
            const code = (err as { code?: string }).code ?? ''
            setError(getAuthErrorMessage(code))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                {/* Encabezado */}
                <div className={styles.header}>
                    <p className={styles.logo}>MateCode</p>
                    <h1 className={styles.title}>Bienvenido de nuevo</h1>
                    <p className={styles.subtitle}>Ingresá a tu cuenta para continuar</p>
                </div>

                {/* Formulario */}
                <form className={styles.form} onSubmit={handleSubmit} noValidate>

                    {/* Mensaje de error (solo se muestra si hay un error) */}
                    {error && (
                        <p className={styles.errorMessage} role="alert" aria-live="polite">
                            {error}
                        </p>
                    )}

                    {/* Campo email */}
                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                            aria-required="true"
                        />
                    </div>

                    {/* Campo contraseña */}
                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            aria-required="true"
                        />
                    </div>

                    {/* Botón de submit */}
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    {/* Separador */}
                    <div className={styles.divider}>o</div>

                    {/* Botón de Google */}
                    <button
                        type="button"
                        className={styles.googleButton}
                        onClick={handleGoogle}
                        disabled={loading}
                    >
                        {/* SVG del logo de Google */}
                        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continuar con Google
                    </button>
                </form>

                {/* Pie */}
                <p className={styles.footer}>
                    ¿No tenés cuenta?{' '}
                    <Link to="/register">Registrate</Link>
                </p>

            </div>
        </div>
    )
}