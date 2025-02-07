import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProvider } from './store/AppContext.jsx'
import App from './App.jsx'
import './index.css'
  
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
    <App />
    </AppProvider>
  </React.StrictMode>,
)
