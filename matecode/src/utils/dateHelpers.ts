// Funciones pequeñas que nos ayudan a trabajar con fechas.

// Convierte una fecha ISO string a formato legible: "5 ene 2026"
export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// Devuelve true si la fecha ya pasó (venció)
export function isOverdue(isoDate: string): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)  // Reseteamos la hora para comparar solo fechas
    return new Date(isoDate) < today
}

// Devuelve true si la fecha es hoy
export function isDueToday(isoDate: string): boolean {
    const today = new Date()
    const due = new Date(isoDate)
    return (
        due.getFullYear() === today.getFullYear() &&
        due.getMonth() === today.getMonth() &&
        due.getDate() === today.getDate()
    )
}