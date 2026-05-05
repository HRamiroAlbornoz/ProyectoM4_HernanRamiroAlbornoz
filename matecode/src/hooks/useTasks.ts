// Este hook centraliza toda la lógica de tareas.
// Los componentes solo llaman a estas funciones sin saber
// cómo funciona Firestore por debajo.

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import {
    subscribeToTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../services/taskService'
import type { Task, TaskFormValues } from '../types/task'

export function useTasks() {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Si no hay usuario logueado, no hacemos nada
        if (!user) return

        setLoading(true)

        // Nos suscribimos a los cambios en tiempo real
        const unsubscribe = subscribeToTasks(
            user.uid,
            (fetchedTasks) => {
                setTasks(fetchedTasks)
                setLoading(false)
            },
            (err) => {
                console.error(err)
                setError('Error al cargar las tareas. Intentá de nuevo.')
                setLoading(false)
            }
        )

        // Cancelamos la suscripción cuando el componente se desmonta
        // Esto evita memory leaks
        return unsubscribe
    }, [user])

    // Calcula el número de orden para la próxima tarea (va al final)
    function getNextOrder(): number {
        if (tasks.length === 0) return 0
        return Math.max(...tasks.map((t) => t.order)) + 1
    }

    async function addTask(formValues: TaskFormValues): Promise<void> {
        if (!user) return
        await createTask(user.uid, formValues, getNextOrder())
    }

    async function editTask(taskId: string, formValues: TaskFormValues): Promise<void> {
        await updateTask(taskId, {
            title: formValues.title,
            description: formValues.description,
            priority: formValues.priority,
            dueDate: formValues.dueDate || null,
        })
    }

    async function removeTask(taskId: string): Promise<void> {
        await deleteTask(taskId)
    }

    async function toggleTask(task: Task): Promise<void> {
        await updateTask(task.id, { completed: !task.completed })
    }

    // Actualiza el orden de todas las tareas después del drag & drop
    async function reorderTasks(reorderedTasks: Task[]): Promise<void> {
        const updates = reorderedTasks.map((task, index) =>
            updateTask(task.id, { order: index })
        )
        await Promise.all(updates)
    }

    return {
        tasks,
        loading,
        error,
        addTask,
        editTask,
        removeTask,
        toggleTask,
        reorderTasks,
    }
}