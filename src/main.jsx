import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import App from './App.jsx'
import { GestureProvider } from './components/GestureContext.jsx'
import 'lenis/dist/lenis.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GestureProvider>
        {/* `root` makes Lenis smooth-scroll the whole page (window). It runs its
            own RAF loop and cleans up on unmount. Tweak feel via `options`:
            lower lerp = smoother/heavier, higher = snappier. */}
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
          <App />
        </ReactLenis>
      </GestureProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
