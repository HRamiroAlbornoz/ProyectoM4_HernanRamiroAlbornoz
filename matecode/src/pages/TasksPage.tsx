// Página principal de la aplicación.
// Muestra las tareas del usuario y permite gestionarlas.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/TaskForm'
import { TaskList } from '../components/TaskList'
import { logout } from '../services/authService'
import { sendTaskSummary } from '../services/emailService'
import type { TaskFormValues } from '../types/task'
import styles from './TasksPage.module.css'

type Filter = 'all' | 'pending' | 'completed'

export function TasksPage() {
    const { user } = useAuth()
    const { tasks, loading, error, addTask, editTask, removeTask, toggleTask, reorderTasks } =
        useTasks()
    const navigate = useNavigate()

    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<Filter>('all')
    const [emailLoading, setEmailLoading] = useState(false)
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle')

    async function handleLogout() {
        await logout()
        navigate('/login')
    }

    async function handleAddTask(values: TaskFormValues) {
        await addTask(values)
        setShowForm(false)
    }

    async function handleSendEmail() {
        if (!user?.email) return
        setEmailLoading(true)
        setEmailStatus('idle')

        try {
            await sendTaskSummary(user.email, tasks)
            setEmailStatus('success')

            // Volvemos al estado normal después de 3 segundos
            setTimeout(() => setEmailStatus('idle'), 3000)
        } catch (error) {
            console.error(error)
            setEmailStatus('error')
            setTimeout(() => setEmailStatus('idle'), 3000)
        } finally {
            setEmailLoading(false)
        }
    }

    // Contadores para las estadísticas
    const completedCount = tasks.filter((t) => t.completed).length
    const pendingCount = tasks.filter((t) => !t.completed).length

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.logo}>MateCode</h1>
                    <div className={styles.headerRight}>
                        <span className={styles.userEmail}>{user?.email}</span>
                        <button
                            className={styles.logoutButton}
                            onClick={handleLogout}
                            aria-label="Cerrar sesión"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Contenido principal ── */}
            <main className={styles.main}>

                {/* Estadísticas */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{tasks.length}</span>
                        <span className={styles.statLabel}>Total</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{pendingCount}</span>
                        <span className={styles.statLabel}>Pendientes</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statNumber} ${styles.statSuccess}`}>
                            {completedCount}
                        </span>
                        <span className={styles.statLabel}>Completadas</span>
                    </div>
                </div>

                {/* Barra de acciones: filtros + botones */}
                <div className={styles.actionsBar}>
                    {/* Filtros */}
                    <div className={styles.filters}>
                        {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
                            <button
                                key={f}
                                className={`${styles.filterButton} ${filter === f ? styles.filterActive : ''}`}
                                onClick={() => setFilter(f)}
                                aria-pressed={filter === f}
                            >
                                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
                            </button>
                        ))}
                    </div>

                    {/* Botones de acción */}
                    <div className={styles.rightActions}>
                        {/* Botón de email */}
                        <button
                            className={styles.emailButton}
                            onClick={handleSendEmail}
                            disabled={emailLoading || tasks.length === 0}
                            aria-busy={emailLoading}
                            title={tasks.length === 0 ? 'No hay tareas para enviar' : 'Enviar resumen por email'}
                        >
                            {emailLoading
                                ? '⏳ Enviando...'
                                : emailStatus === 'success'
                                    ? '✅ ¡Enviado!'
                                    : emailStatus === 'error'
                                        ? '❌ Error'
                                        : '📧 Enviar resumen'}
                        </button>

                        {/* Botón nueva tarea */}
                        <button
                            className={styles.newTaskButton}
                            onClick={() => setShowForm((prev) => !prev)}
                            aria-expanded={showForm}
                        >
                            {showForm ? '✕ Cancelar' : '+ Nueva tarea'}
                        </button>
                    </div>
                </div>

                {/* Formulario de nueva tarea (visible solo cuando showForm es true) */}
                {showForm && (
                    <TaskForm
                        onSubmit={handleAddTask}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {/* Error al cargar tareas */}
                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                {/* Lista de tareas */}
                {loading ? (
                    <div className={styles.loading} aria-live="polite">
                        Cargando tareas...
                    </div>
                ) : (
                    <TaskList
                        tasks={tasks}
                        filter={filter}
                        onEdit={editTask}
                        onDelete={removeTask}
                        onToggle={toggleTask}
                        onReorder={reorderTasks}
                    />
                )}

            </main>
        </div>
    )
}