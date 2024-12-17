import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que sea accesible desde cualquier IP de la red local
    port: 5000,       // Puerto en el que se ejecutará la aplicación (puedes cambiarlo si lo deseas)
  }
})
