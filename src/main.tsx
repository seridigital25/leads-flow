import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initSecurityGuard } from './lib/securityGuard'
import { initAnalytics } from './lib/analytics'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Initialize client-side source protection guard
initSecurityGuard()

// Initialize Plausible analytics (pageview; production only, no-ops locally)
initAnalytics()

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SpeedInsights />
      <App />
    </StrictMode>,
  )
}
