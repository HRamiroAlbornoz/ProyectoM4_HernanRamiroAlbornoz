// Todas las operaciones con Firestore relacionadas a tareas.
// Separamos esto de los componentes para mantener el código organizado.

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, TaskFormValues } from '../types/task'

// Nombre de la colección en Firestore
const COLLECTION = 'tasks'

// Crea una nueva tarea en Firestore
export async function createTask(
    userId: string,
    formValues: TaskFormValues,
    order: number
): Promise<void> {
    await addDoc(collection(db, COLLECTION), {
        userId,
        title: formValues.title,
        description: formValues.description,
        priority: formValues.priority,
        dueDate: formValues.dueDate || null,
        completed: false,
        order,
        createdAt: new Date().toISOString(),
    })
}

// Actualiza campos específicos de una tarea existente
export async function updateTask(
    taskId: string,
    data: Partial<Task>
): Promise<void> {
    const taskRef = doc(db, COLLECTION, taskId)
    await updateDoc(taskRef, data)
}

// Elimina una tarea
export async function deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, taskId))
}

// Se suscribe en tiempo real a las tareas del usuario.
// onSnapshot llama a onData cada vez que hay un cambio en Firestore,
// sin necesidad de recargar la página.
// Devuelve una función para cancelar la suscripción.
export function subscribeToTasks(
    userId: string,
    onData: (tasks: Task[]) => void,
    onError: (error: Error) => void
): () => void {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('order', 'asc')
    )

    return onSnapshot(
        q,
        (snapshot) => {
            const tasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[]
            onData(tasks)
        },
        onError
    )
}