// Configuración principal de Vite.
// Aquí le decimos cómo debe construir el proyecto y cómo correr los tests.

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Configuración para Vitest (nuestro framework de tests)
  test: {
    // "jsdom" simula un navegador para que los tests puedan
    // interactuar con el DOM sin abrir un navegador real
    environment: 'jsdom',

    // Este archivo se ejecuta antes de cada test.
    // Lo vamos a crear en el siguiente paso.
    setupFiles: ['./tests/setup.ts'],

    // Permite usar funciones de test como "describe" y "it"
    // sin tener que importarlas en cada archivo
    globals: true,
  },
})