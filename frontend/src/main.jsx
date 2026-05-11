import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './global.css'
import './ui-system.css'

const router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter
const app = React.createElement(router, null, <App />)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {app}
  </React.StrictMode>
)
