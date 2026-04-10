import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { syncRootThemeBeforeReact } from './lib/theme'
import './tailwind.css'

syncRootThemeBeforeReact()

const rootEl = document.getElementById('root')
if (!rootEl)
  throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
