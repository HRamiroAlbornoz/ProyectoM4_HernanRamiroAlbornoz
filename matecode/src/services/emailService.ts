// Esta función llama a nuestra Vercel Function desde el frontend.
// El frontend NUNCA habla con AWS directamente.
// Siempre pasa por nuestra función serverless.

import type { Task } from '../types/task'

export async function sendTaskSummary(to: string, tasks: Task[]): Promise<void> {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, tasks }),
    })

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Error al enviar el email')
    }
}