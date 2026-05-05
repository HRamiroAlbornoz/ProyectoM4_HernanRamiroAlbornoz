// Formulario reutilizable para crear y editar tareas.
// Si recibe initialValues, está en modo edición. Si no, en modo creación.

import { useState } from 'react'
import type { TaskFormValues, Priority } from '../types/task'
import styles from './TaskForm.module.css'

interface TaskFormProps {
    initialValues?: TaskFormValues   // Si viene, estamos editando
    onSubmit: (values: TaskFormValues) => Promise<void>
    onCancel: () => void
}

// Valores por defecto para una tarea nueva
const DEFAULT_VALUES: TaskFormValues = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
}

export function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
    const [values, setValues] = useState<TaskFormValues>(
        initialValues ?? DEFAULT_VALUES
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditing = !!initialValues

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (!values.title.trim()) {
            setError('El título es obligatorio.')
            return
        }

        setLoading(true)
        try {
            await onSubmit(values)
        } catch {
            setError('Ocurrió un error. Intentá de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    // Función genérica para actualizar cualquier campo del formulario
    function handleChange(field: keyof TaskFormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.formTitle}>
                {isEditing ? 'Editar tarea' : 'Nueva tarea'}
            </h3>

            <form onSubmit={handleSubmit} className={styles.form}>

                {error && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}

                <div className={styles.fieldGroup}>
                    <label htmlFor="task-title" className={styles.label}>
                        Título *
                    </label>
                    <input
                        id="task-title"
                        type="text"
                        className={styles.input}
                        value={values.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="¿Qué hay que hacer?"
                        maxLength={100}
                        required
                        aria-required="true"
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="task-description" className={styles.label}>
                        Descripción
                    </label>
                    <textarea
                        id="task-description"
                        className={styles.textarea}
                        value={values.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Detalles opcionales..."
                        rows={3}
                        maxLength={500}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="task-priority" className={styles.label}>
                            Prioridad
                        </label>
                        <select
                            id="task-priority"
                            className={styles.select}
                            value={values.priority}
                            onChange={(e) => handleChange('priority', e.target.value as Priority)}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="task-dueDate" className={styles.label}>
                            Fecha de vencimiento
                        </label>
                        <input
                            id="task-dueDate"
                            type="date"
                            className={styles.input}
                            value={values.dueDate}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                        aria-busy={loading}
                    >
                        {loading
                            ? 'Guardando...'
                            : isEditing
                                ? 'Guardar cambios'
                                : 'Crear tarea'}
                    </button>
                </div>

            </form>
        </div>
    )
}