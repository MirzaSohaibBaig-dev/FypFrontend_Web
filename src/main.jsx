import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. BrowserRouter import karein
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App ko BrowserRouter ke andar band kar dein */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)