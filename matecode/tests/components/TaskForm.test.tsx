// Tests del componente TaskForm.
// Verificamos que el formulario se comporta correctamente
// en distintas situaciones.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../../src/components/TaskForm'

// vi.fn() crea una función "espía" que registra si fue llamada y con qué argumentos
const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
const mockOnCancel = vi.fn()

describe('TaskForm', () => {

    // Antes de cada test, limpiamos el historial de llamadas de los mocks
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('muestra el título "Nueva tarea" en modo creación', () => {
        render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        expect(screen.getByText('Nueva tarea')).toBeInTheDocument()
    })

    it('muestra el título "Editar tarea" cuando recibe initialValues', () => {
        render(
            <TaskForm
                initialValues={{
                    title: 'Tarea existente',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                }}
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
            />
        )

        expect(screen.getByText('Editar tarea')).toBeInTheDocument()
    })

    it('muestra error y NO llama onSubmit si el título está vacío', async () => {
        const { container } = render(
            <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        )

        // Intentamos enviar el formulario sin título
        // Disparamos el submit directamente en el formulario
        fireEvent.submit(container.querySelector('form')!)

        // Esperamos que el mensaje de error aparezca en el DOM
        await waitFor(() => {
            expect(screen.getByText('El título es obligatorio.')).toBeInTheDocument()
        })

        // No debe haber llamado a onSubmit
        expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('llama onSubmit con los valores correctos cuando el formulario es válido', async () => {
        render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        // Escribimos un título
        await userEvent.type(screen.getByLabelText(/título/i), 'Mi tarea de prueba')

        // Enviamos el formulario
        await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }))

        // Verificamos que onSubmit fue llamado con el título correcto
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Mi tarea de prueba' })
            )
        })
    })

    it('llama onCancel cuando se hace clic en Cancelar', async () => {
        render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

        await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))

        expect(mockOnCancel).toHaveBeenCalledOnce()
    })

    it('precarga los valores iniciales en modo edición', () => {
        render(
            <TaskForm
                initialValues={{
                    title: 'Tarea a editar',
                    description: 'Descripción de prueba',
                    priority: 'high',
                    dueDate: '',
                }}
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
            />
        )

        // El input de título debe tener el valor inicial
        expect(screen.getByLabelText(/título/i)).toHaveValue('Tarea a editar')
    })

})