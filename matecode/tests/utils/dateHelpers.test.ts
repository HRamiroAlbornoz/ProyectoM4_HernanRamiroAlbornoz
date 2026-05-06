// Tests unitarios para las funciones que manejan fechas.

import { describe, it, expect } from 'vitest'
import { formatDate, isOverdue, isDueToday } from '../../src/utils/dateHelpers'

describe('formatDate', () => {

    it('devuelve un string que contiene el año de la fecha', () => {
        const result = formatDate('2026-06-15')
        expect(result).toContain('2026')
    })

    it('devuelve un string que contiene el día de la fecha', () => {
        const result = formatDate('2026-06-15')
        expect(result).toContain('15')
    })

})

describe('isOverdue', () => {

    it('devuelve true para una fecha del pasado', () => {
        expect(isOverdue('2020-01-01')).toBe(true)
    })

    it('devuelve false para una fecha del futuro', () => {
        expect(isOverdue('2099-12-31')).toBe(false)
    })

})

describe('isDueToday', () => {

    it('devuelve true para la fecha de hoy', () => {
        // Generamos la fecha de hoy en hora local (no UTC)
        const now = new Date()
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
        ].join('-')

        expect(isDueToday(today)).toBe(true)
    })

    it('devuelve false para una fecha del pasado', () => {
        expect(isDueToday('2020-01-01')).toBe(false)
    })

    it('devuelve false para una fecha del futuro', () => {
        expect(isDueToday('2099-12-31')).toBe(false)
    })

})