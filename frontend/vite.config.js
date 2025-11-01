import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true, // ✅ Correct place for host setting
    https: true, // ✅ Enable HTTPS for camera/mic access on mobile
  },
  define: {
    global: 'window', // ✅ Fix "global is not defined" error for browser builds
  },
})
