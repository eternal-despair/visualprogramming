/// <referense types = "vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    enviroment: 'jdsom',
    setupFiles: './src/setupTests.ts',
  },
})
