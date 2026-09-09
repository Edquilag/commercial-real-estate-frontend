import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { MarketplaceProvider } from './context/MarketplaceContext'
import './index.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </BrowserRouter>
  </StrictMode>,
)