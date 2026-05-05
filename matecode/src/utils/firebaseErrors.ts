// Firebase devuelve códigos de error internos que el usuario no entendería.
// Esta función los traduce a mensajes claros en español.

export function getAuthErrorMessage(code: string): string {
    // Un objeto que mapea cada código de error a su mensaje en español
    const errors: Record<string, string> = {
        'auth/email-already-in-use': 'Este email ya está registrado.',
        'auth/invalid-email': 'El formato del email no es válido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-not-found': 'No existe una cuenta con este email.',
        'auth/wrong-password': 'La contraseña es incorrecta.',
        'auth/invalid-credential': 'Email o contraseña incorrectos.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intentá más tarde.',
        'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de completar el inicio de sesión.',
    }

    // Si el código existe en el objeto, devolvemos su mensaje.
    // Si no existe, devolvemos un mensaje genérico.
    return errors[code] ?? 'Ocurrió un error inesperado. Intentá de nuevo.'
}