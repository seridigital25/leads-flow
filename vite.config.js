import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import JavaScriptObfuscator from 'javascript-obfuscator'

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

// Custom Deep Obfuscation Plugin for Production Chunks
function codeObfuscatorPlugin() {
  return {
    name: 'vite-plugin-deep-code-obfuscator',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          const obfuscationResult = JavaScriptObfuscator.obfuscate(chunk.code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.65,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.25,
            identifierNamesGenerator: 'hexadecimal',
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 8,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['base64', 'rc4'],
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
          });
          chunk.code = obfuscationResult.getObfuscatedCode();
        }
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    codeObfuscatorPlugin()
  ],
  server: {
    headers: securityHeaders
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
    }
  }
})
