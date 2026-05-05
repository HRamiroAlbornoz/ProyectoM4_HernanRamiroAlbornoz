// Muestra una tarea individual con sus acciones (editar, eliminar, completar).
// También maneja el drag & drop con dnd-kit.

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskForm } from './TaskForm'
import { formatDate, isOverdue, isDueToday } from '../utils/dateHelpers'
import type { Task, TaskFormValues } from '../types/task'
import styles from './TaskCard.module.css'

interface TaskCardProps {
    task: Task
    onEdit: (taskId: string, values: TaskFormValues) => Promise<void>
    onDelete: (taskId: string) => Promise<void>
    onToggle: (task: Task) => Promise<void>
    isDragDisabled: boolean  // true cuando hay un filtro activo
}

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' }

export function TaskCard({
    task,
    onEdit,
    onDelete,
    onToggle,
    isDragDisabled,
}: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    // deleteConfirm pide confirmación antes de eliminar
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    // Hook de dnd-kit: convierte este componente en arrastrable
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, disabled: isDragDisabled })

    // Estilos que aplica dnd-kit durante el arrastre
    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    async function handleEdit(values: TaskFormValues) {
        await onEdit(task.id, values)
        setIsEditing(false)
    }

    async function handleDelete() {
        // Primer clic: pide confirmación. Segundo clic: elimina.
        if (!deleteConfirm) {
            setDeleteConfirm(true)
            return
        }
        await onDelete(task.id)
    }

    // Determina el estado visual de la fecha de vencimiento
    function getDueDateStatus(): 'overdue' | 'today' | 'normal' | null {
        if (!task.dueDate) return null
        if (!task.completed && isOverdue(task.dueDate)) return 'overdue'
        if (!task.completed && isDueToday(task.dueDate)) return 'today'
        return 'normal'
    }

    const dueDateStatus = getDueDateStatus()

    // Si está en modo edición, mostramos el formulario en lugar de la tarjeta
    if (isEditing) {
        return (
            <div ref={setNodeRef} style={dragStyle}>
                <TaskForm
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        dueDate: task.dueDate ?? '',
                    }}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={dragStyle}
            className={`${styles.card} ${task.completed ? styles.completed : ''}`}
        >
            {/* Handle de arrastre (solo visible cuando no hay filtro activo) */}
            {!isDragDisabled && (
                <div
                    className={styles.dragHandle}
                    {...attributes}
                    {...listeners}
                    aria-label="Arrastrar para reordenar"
                    title="Arrastrar para reordenar"
                >
                    ⠿
                </div>
            )}

            {/* Contenido de la tarjeta */}
            <div className={styles.content}>

                {/* Fila superior: checkbox + título + prioridad + acciones */}
                <div className={styles.topRow}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={task.completed}
                        onChange={() => onToggle(task)}
                        aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    />

                    <div className={styles.titleArea}>
                        <h3 className={styles.title}>{task.title}</h3>
                        <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                            {PRIORITY_LABELS[task.priority]}
                        </span>
                    </div>

                    {/* Botones de acción */}
                    <div className={styles.actions}>
                        <button
                            className={styles.editBtn}
                            onClick={() => { setIsEditing(true); setDeleteConfirm(false) }}
                            aria-label="Editar tarea"
                            title="Editar"
                        >
                            ✏️
                        </button>
                        <button
                            className={`${styles.deleteBtn} ${deleteConfirm ? styles.confirming : ''}`}
                            onClick={handleDelete}
                            onBlur={() => setDeleteConfirm(false)}
                            aria-label={deleteConfirm ? 'Confirmar eliminación' : 'Eliminar tarea'}
                            title={deleteConfirm ? 'Clic para confirmar' : 'Eliminar'}
                        >
                            {deleteConfirm ? '¿Eliminar?' : '🗑️'}
                        </button>
                    </div>
                </div>

                {/* Descripción (solo si tiene) */}
                {task.description && (
                    <p className={styles.description}>{task.description}</p>
                )}

                {/* Fecha de vencimiento (solo si tiene) */}
                {task.dueDate && (
                    <p className={`${styles.dueDate} ${dueDateStatus ? styles[dueDateStatus] : ''}`}>
                        📅{' '}
                        {dueDateStatus === 'overdue'
                            ? `Venció el ${formatDate(task.dueDate)}`
                            : dueDateStatus === 'today'
                                ? 'Vence hoy'
                                : `Vence el ${formatDate(task.dueDate)}`}
                    </p>
                )}

            </div>
        </div>
    )
}