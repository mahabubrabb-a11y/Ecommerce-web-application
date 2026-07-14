import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/super-admin", // ব্রাউজারে /super-admin পাথে রান করার জন্য
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3001, //  রিয়্যাক্ট অ্যাপ এখন ৩০০১ পোর্টে চলবে
    proxy: {
      "/api/": {
        target: "http://localhost:5003", //backend project run port number
        changeOrigin: true,
        secure: false,
      },
    },
  },
}) 
