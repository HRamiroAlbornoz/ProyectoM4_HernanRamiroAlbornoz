// Acá definimos la "forma" de los datos relacionados con autenticación.
// TypeScript usa estas definiciones para detectar errores antes de ejecutar el código.

export interface AuthFormValues {
    email: string
    password: string
    confirmPassword?: string  // Solo se usa en el registro
}