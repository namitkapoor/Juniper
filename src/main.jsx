import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './Pages/App'
import './style/index.css'

// Create root only once
const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
