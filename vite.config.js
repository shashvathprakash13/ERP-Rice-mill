import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    // allow localtunnel / ngrok hostnames (all *.loca.lt and *.ngrok.io)
    allowedHosts: ['.loca.lt', '.ngrok.io', 'localhost']
  }
})
