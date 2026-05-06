// Funciones pequeñas que nos ayudan a trabajar con fechas.

// Parsea una fecha YYYY-MM-DD como hora local (no UTC)
// Esto evita problemas de zona horaria
function parseLocalDate(isoDate: string): Date {
    const [year, month, day] = isoDate.split('-').map(Number)
    return new Date(year, month - 1, day) // month - 1 porque los meses son 0-indexados
}

// Convierte una fecha ISO string a formato legible: "5 ene 2026"
export function formatDate(isoDate: string): string {
    return parseLocalDate(isoDate).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// Devuelve true si la fecha ya pasó (venció)
export function isOverdue(isoDate: string): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0)  // Reseteamos la hora para comparar solo fechas
    return parseLocalDate(isoDate) < today
}

// Devuelve true si la fecha es hoy
export function isDueToday(isoDate: string): boolean {
    const today = new Date()
    const due = parseLocalDate(isoDate)
    return (
        due.getFullYear() === today.getFullYear() &&
        due.getMonth() === today.getMonth() &&
        due.getDate() === today.getDate()
    )
}