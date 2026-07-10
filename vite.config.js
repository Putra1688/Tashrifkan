import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Otomatis update cache jika ada perubahan kode
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Tashrifkan - Belajar Shorof Interaktif',
        short_name: 'Tashrifkan',
        description: 'Media pembelajaran interaktif ilmu Shorof dan konsep Mabni berbasis game.',
        theme_color: '#0f172a', // Menyesuaikan bg-slate-950/900
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'landscape', // <-- Mengunci orientasi aplikasi secara sistem ke Landscape!
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Supaya ikon pas di berbagai bentuk UI HP
          }
        ]
      }
    })
  ],
})
