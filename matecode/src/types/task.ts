// Acá definimos la "forma" de una tarea en toda la aplicación.
// TypeScript usará esta definición para detectar errores en el código.

// Las prioridades posibles de una tarea
export type Priority = 'low' | 'medium' | 'high'

// La estructura completa de una tarea
export interface Task {
    id: string               // ID único generado por Firestore
    userId: string           // ID del usuario dueño de la tarea
    title: string            // Título de la tarea
    description: string      // Descripción de la tarea
    completed: boolean       // Si la tarea está completada o no
    priority: Priority       // Prioridad: baja, media o alta
    dueDate: string | null   // Fecha de vencimiento (o null si no tiene)
    order: number            // Posición en la lista (para drag & drop)
    createdAt: string        // Fecha de creación (en formato ISO string)
}

// Este tipo representa los datos del formulario al crear/editar una tarea.
// No incluye id, userId, createdAt ni order porque esos los genera el sistema.
export interface TaskFormValues {
    title: string
    description: string
    priority: Priority
    dueDate: string          // string porque los inputs de fecha devuelven strings
}