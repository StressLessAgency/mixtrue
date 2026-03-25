import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './app.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0D1421',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#F0F4FF',
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
