import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Kích hoạt tạo chứng chỉ SSL giả lập để chạy https ở local
  ],
  server: {
    https: true, // Bật https cho Vite dev server
    port: 5173
  }
})