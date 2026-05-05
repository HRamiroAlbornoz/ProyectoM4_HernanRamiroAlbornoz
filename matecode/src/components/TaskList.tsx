// Muestra la lista de tareas con soporte para drag & drop.
// Usa DndContext de dnd-kit para manejar el arrastre.

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import type { Task, TaskFormValues } from '../types/task'
import styles from './TaskList.module.css'

type Filter = 'all' | 'pending' | 'completed'

interface TaskListProps {
    tasks: Task[]
    filter: Filter
    onEdit: (taskId: string, values: TaskFormValues) => Promise<void>
    onDelete: (taskId: string) => Promise<void>
    onToggle: (task: Task) => Promise<void>
    onReorder: (reorderedTasks: Task[]) => Promise<void>
}

export function TaskList({
    tasks,
    filter,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
}: TaskListProps) {

    // El drag & drop solo funciona cuando se muestran todas las tareas
    const isDragDisabled = filter !== 'all'

    // Filtramos las tareas según el filtro activo
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed
        if (filter === 'pending') return !task.completed
        return true
    })

    // Sensores de dnd-kit: permite arrastrar con mouse/touch y con teclado
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Se ejecuta cuando el usuario suelta una tarjeta después de arrastrarla
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        // Si no hay destino o es la misma posición, no hacemos nada
        if (!over || active.id === over.id) return

        const oldIndex = tasks.findIndex((t) => t.id === active.id)
        const newIndex = tasks.findIndex((t) => t.id === over.id)

        // arrayMove reorganiza el array según los índices
        const reordered = arrayMove(tasks, oldIndex, newIndex)
        onReorder(reordered)
    }

    // Mensaje cuando no hay tareas para mostrar
    if (filteredTasks.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyText}>
                    {filter === 'completed'
                        ? '¡No hay tareas completadas todavía!'
                        : filter === 'pending'
                            ? '¡No hay tareas pendientes!'
                            : 'No tenés tareas. ¡Creá una con el botón de arriba!'}
                </p>
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            {/* SortableContext necesita los IDs de todas las tareas */}
            <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={styles.list}>
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggle={onToggle}
                            isDragDisabled={isDragDisabled}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}