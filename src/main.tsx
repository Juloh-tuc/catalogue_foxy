// Maven Pro
import "@fontsource/maven-pro/400.css";
import "@fontsource/maven-pro/600.css";
import "@fontsource/maven-pro/700.css";

// Roboto
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'         // <<<<<< IMPORTANT
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
