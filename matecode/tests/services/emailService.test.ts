// Tests del servicio de email.
// Verificamos qué pasa cuando el serverless responde con éxito
// y qué pasa cuando falla (caso borde requerido por la rúbrica).

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendTaskSummary } from '../../src/services/emailService'
import type { Task } from '../../src/types/task'

// Mockeamos la función global fetch para no hacer llamadas reales
const mockFetch = vi.fn()

describe('sendTaskSummary', () => {

    beforeEach(() => {
        // vi.stubGlobal es la forma correcta en Vitest para mockear globales
        vi.stubGlobal('fetch', mockFetch)
        vi.clearAllMocks()
    })

    // Tarea de prueba que usaremos en los tests
    const mockTasks: Task[] = [
        {
            id: 'task-1',
            userId: 'user-1',
            title: 'Tarea de prueba',
            description: 'Descripción de prueba',
            completed: false,
            priority: 'medium',
            dueDate: null,
            order: 0,
            createdAt: '2026-01-01T00:00:00.000Z',
        },
    ]

    describe('sendTaskSummary', () => {

        beforeEach(() => {
            vi.clearAllMocks()
        })

        it('resuelve correctamente cuando el serverless responde con éxito', async () => {
            // Simulamos una respuesta exitosa del serverless
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({ success: true }),
            })

            await expect(
                sendTaskSummary('test@example.com', mockTasks)
            ).resolves.not.toThrow()
        })

        // Caso borde: el serverless falla (error 500, credenciales inválidas, etc.)
        it('lanza un error cuando el serverless falla', async () => {
            // Simulamos una respuesta de error del serverless
            mockFetch.mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'Error al enviar el email' }),
            })

            await expect(
                sendTaskSummary('test@example.com', mockTasks)
            ).rejects.toThrow('Error al enviar el email')
        })

        // Caso borde: el serverless falla sin mensaje de error
        it('lanza error genérico cuando el serverless falla sin mensaje', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                json: async () => ({}),
            })

            await expect(
                sendTaskSummary('test@example.com', mockTasks)
            ).rejects.toThrow('Error al enviar el email')
        })

        it('llama a fetch con los parámetros correctos', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: async () => ({ success: true }),
            })

            await sendTaskSummary('test@example.com', mockTasks)

            // Verificamos que fetch fue llamado con los datos correctos
            expect(mockFetch).toHaveBeenCalledWith('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: 'test@example.com', tasks: mockTasks }),
            })
        })

    })
})