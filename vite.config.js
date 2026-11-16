import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// NOTE: The custom javascript-obfuscator plugin was removed.
// controlFlowFlattening + deadCodeInjection + stringArray(rc4) inflated the
// bundle from ~350 KB to 2.7 MB (971 KB gzip). Terser minification below
// already strips comments/mangles names; obfuscation added size, not security.

// Enterprise Security Headers Configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    headers: securityHeaders,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  preview: {
    headers: securityHeaders
  },
  build: {
    sourcemap: false, // Prevents leaking original TypeScript/JSX source code
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Allow security watermark notice
        drop_debugger: true,
        passes: 2
      },
      format: {
        comments: false // Strips all license & code comments
      },
      mangle: {
        toplevel: true
      }
    },
    rollupOptions: {
      output: {
        // Vendor chunk splitting (rolldown requires function form):
        // stable framework code cached separately from app code, and
        // lucide-react icons isolated from React core.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'lucide-react';
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react/') || id.includes('scheduler')) return 'react';
          }
        }
      }
    }
  }
})
