// Página de registro de nuevos usuarios.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerWithEmail, loginWithGoogle } from '../services/authService'
import { getAuthErrorMessage } from '../utils/firebaseErrors'
import styles from './AuthPages.module.css'

export function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        // Validamos que las contraseñas coincidan antes de llamar a Firebase
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        // Validamos longitud mínima
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.')
            return
        }

        setLoading(true)

        try {
            await registerWithEmail(email, password)
            navigate('/tasks')
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? ''
            setError(getAuthErrorMessage(code))
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogle() {
        setError('')
        setLoading(true)

        try {
            await loginWithGoogle()
            navigate('/tasks')
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? ''
            setError(getAuthErrorMessage(code))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <div className={styles.header}>
                    <p className={styles.logo}>MateCode</p>
                    <h1 className={styles.title}>Crear cuenta</h1>
                    <p className={styles.subtitle}>Registrate para empezar a gestionar tus tareas</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>

                    {error && (
                        <p className={styles.errorMessage} role="alert" aria-live="polite">
                            {error}
                        </p>
                    )}

                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
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

                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                            autoComplete="new-password"
                            aria-required="true"
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirmar contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repetí tu contraseña"
                            required
                            autoComplete="new-password"
                            aria-required="true"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <div className={styles.divider}>o</div>

                    <button
                        type="button"
                        className={styles.googleButton}
                        onClick={handleGoogle}
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continuar con Google
                    </button>
                </form>

                <p className={styles.footer}>
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login">Ingresá acá</Link>
                </p>

            </div>
        </div>
    )
}