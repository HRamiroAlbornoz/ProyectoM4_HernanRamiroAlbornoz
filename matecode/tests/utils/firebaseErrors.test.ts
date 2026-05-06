// Tests unitarios para la función que traduce errores de Firebase.
// Un test unitario prueba una función pequeña de forma aislada.

import { describe, it, expect } from 'vitest'
import { getAuthErrorMessage } from '../../src/utils/firebaseErrors'

describe('getAuthErrorMessage', () => {

    it('devuelve el mensaje correcto para email ya registrado', () => {
        const result = getAuthErrorMessage('auth/email-already-in-use')
        expect(result).toBe('Este email ya está registrado.')
    })

    it('devuelve el mensaje correcto para credenciales inválidas', () => {
        const result = getAuthErrorMessage('auth/invalid-credential')
        expect(result).toBe('Email o contraseña incorrectos.')
    })

    it('devuelve el mensaje correcto para contraseña incorrecta', () => {
        const result = getAuthErrorMessage('auth/wrong-password')
        expect(result).toBe('La contraseña es incorrecta.')
    })

    it('devuelve el mensaje correcto para demasiados intentos', () => {
        const result = getAuthErrorMessage('auth/too-many-requests')
        expect(result).toBe('Demasiados intentos fallidos. Intentá más tarde.')
    })

    // Caso borde: código desconocido
    it('devuelve mensaje genérico para un código de error desconocido', () => {
        const result = getAuthErrorMessage('auth/codigo-inexistente')
        expect(result).toBe('Ocurrió un error inesperado. Intentá de nuevo.')
    })

    // Caso borde: string vacío
    it('devuelve mensaje genérico para un string vacío', () => {
        const result = getAuthErrorMessage('')
        expect(result).toBe('Ocurrió un error inesperado. Intentá de nuevo.')
    })

})