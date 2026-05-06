// Esta es una Vercel Function (función serverless).
// Se ejecuta en el servidor, no en el navegador del usuario.
// Por eso puede usar las credenciales de AWS de forma segura.

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Task } from '../src/types/task'

// Inicializamos el cliente de AWS SES con las credenciales
// que están en las variables de entorno del servidor
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    const { to, tasks } = req.body as { to: string; tasks: Task[] }

    // Validamos que lleguen los datos necesarios
    if (!to || !tasks) {
        return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Separamos las tareas por estado
    const pending = tasks.filter((t) => !t.completed)
    const completed = tasks.filter((t) => t.completed)

    // Construimos el cuerpo del email en HTML
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7C3AED;">📋 Resumen de tareas — MateCode</h2>

      <h3 style="color: #F59E0B;">⏳ Pendientes (${pending.length})</h3>
      ${pending.length > 0
            ? `<ul>${pending.map((t) => `<li><strong>${t.title}</strong>${t.description ? `: ${t.description}` : ''}</li>`).join('')}</ul>`
            : '<p>No hay tareas pendientes.</p>'
        }

      <h3 style="color: #10B981;">✅ Completadas (${completed.length})</h3>
      ${completed.length > 0
            ? `<ul>${completed.map((t) => `<li><strong>${t.title}</strong></li>`).join('')}</ul>`
            : '<p>No hay tareas completadas.</p>'
        }

      <hr style="border-color: #E2E8F0; margin-top: 24px;" />
      <p style="color: #94A3B8; font-size: 12px;">
        Este resumen fue generado por MateCode.
        Total: ${tasks.length} tareas.
      </p>
    </div>
  `

    // Versión en texto plano (para clientes de email que no soportan HTML)
    const textBody = `
Resumen de tareas — MateCode

PENDIENTES (${pending.length}):
${pending.map((t) => `- ${t.title}`).join('\n') || 'No hay tareas pendientes.'}

COMPLETADAS (${completed.length}):
${completed.map((t) => `- ${t.title}`).join('\n') || 'No hay tareas completadas.'}

Total: ${tasks.length} tareas.
  `.trim()

    try {
        await sesClient.send(
            new SendEmailCommand({
                Source: process.env.AWS_SES_FROM_EMAIL!,
                Destination: { ToAddresses: [to] },
                Message: {
                    Subject: {
                        Data: `Resumen de tus tareas — MateCode (${pending.length} pendientes)`,
                    },
                    Body: {
                        Html: { Data: htmlBody },
                        Text: { Data: textBody },
                    },
                },
            })
        )

        return res.status(200).json({ success: true })
    } catch (error) {
        console.error('Error al enviar email con SES:', error)
        return res.status(500).json({ error: 'Error al enviar el email. Intentá de nuevo.' })
    }
}