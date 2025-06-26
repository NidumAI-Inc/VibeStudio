import React from 'react'
import ReactDOM from 'react-dom/client'

import ClientWrapper from './components/common/client-wrapper'
import App from './app'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClientWrapper>
      <App />
    </ClientWrapper>
  </React.StrictMode>
)
