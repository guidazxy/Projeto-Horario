import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite com React e proxy para a API Python (FastAPI + Uvicorn)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
