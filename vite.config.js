import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({}),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,gif}'],
        globIgnores: ['resources/**'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/resources\//],
        runtimeCaching: [
          {
            urlPattern: /\/resources\/.*\.(atlas|skel|json|png|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'spine-model-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'GCG Card Viewer',
        short_name: 'GCG Viewer',
        description: 'A Genius Invokation TCG dynamic card viewer.',
        theme_color: '#6c4d36',
        icons: [
          {
            'src': 'pwa-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
            'purpose': 'any'
          },
          {
            'src': 'pwa-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
            'purpose': 'any'
          },
          {
            'src': 'pwa-maskable-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
            'purpose': 'maskable'
          },
          {
            'src': 'pwa-maskable-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
            'purpose': 'maskable'
          }
        ]
      }
    })
  ],
  base: "./",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
