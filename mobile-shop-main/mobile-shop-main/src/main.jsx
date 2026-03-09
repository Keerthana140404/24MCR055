/**
 * Main Entry Point
 * ================
 * This is the entry point for the React application.
 * It renders the App component into the root DOM element.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
