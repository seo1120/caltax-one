import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { amplifyConfig } from './amplify-config'
import './index.css'
import App from './App.jsx'

// Amplify 설정 초기화
Amplify.configure(amplifyConfig)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
