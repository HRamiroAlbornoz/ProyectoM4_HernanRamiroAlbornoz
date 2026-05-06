// Tests del componente TaskCard.
// Mockeamos dnd-kit para aislar el componente de su dependencia de drag & drop.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from '../../src/components/TaskCard'
import type { Task } from '../../src/types/task'

// ── Mocks ──────────────────────────────────────────────────────────────
// Simulamos dnd-kit para que TaskCard funcione sin necesitar un DndContext real
vi.mock('@dnd-kit/sortable', () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}))

vi.mock('@dnd-kit/utilities', () => ({
    CSS: {
        Transform: {
            toString: () => '',
        },
    },
}))
// ───────────────────────────────────────────────────────────────────────

// Tarea de prueba que usaremos en los tests
const mockTask: Task = {
    id: 'task-123',
    userId: 'user-abc',
    title: 'Comprar leche',
    description: 'En el supermercado',
    completed: false,
    priority: 'medium',
    dueDate: null,
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
}

// Funciones espía para las props de TaskCard
const mockOnEdit = vi.fn().mockResolvedValue(undefined)
const mockOnDelete = vi.fn().mockResolvedValue(undefined)
const mockOnToggle = vi.fn().mockResolvedValue(undefined)

describe('TaskCard', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('muestra el título de la tarea', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        expect(screen.getByText('Comprar leche')).toBeInTheDocument()
    })

    it('muestra la descripción de la tarea', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        expect(screen.getByText('En el supermercado')).toBeInTheDocument()
    })

    it('llama onToggle cuando se hace clic en el checkbox', async () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        const checkbox = screen.getByRole('checkbox')
        await userEvent.click(checkbox)

        expect(mockOnToggle).toHaveBeenCalledWith(mockTask)
    })

    it('pide confirmación antes de eliminar (primer clic muestra texto de confirmación)', async () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        // Primer clic: debe mostrar confirmación, NO eliminar
        await userEvent.click(screen.getByLabelText('Eliminar tarea'))

        expect(screen.getByText('¿Eliminar?')).toBeInTheDocument()
        expect(mockOnDelete).not.toHaveBeenCalled()
    })

    it('llama onDelete al confirmar la eliminación (segundo clic)', async () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        // Primer clic: confirmación
        await userEvent.click(screen.getByLabelText('Eliminar tarea'))
        // Segundo clic: elimina
        await userEvent.click(screen.getByText('¿Eliminar?'))

        expect(mockOnDelete).toHaveBeenCalledWith('task-123')
    })

    it('muestra el badge de prioridad correctamente', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        expect(screen.getByText('Media')).toBeInTheDocument()
    })

    // Caso borde: tarea completada
    it('el checkbox aparece marcado cuando la tarea está completada', () => {
        const completedTask = { ...mockTask, completed: true }

        render(
            <TaskCard
                task={completedTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onToggle={mockOnToggle}
                isDragDisabled={false}
            />
        )

        expect(screen.getByRole('checkbox')).toBeChecked()
    })

})