import { createContext, useContext, useState } from 'react'

// Shared on/off state for gesture control, so the navbar toggle and the
// GestureControl component (which owns the camera) can talk to each other.
const GestureContext = createContext({
  enabled: false,
  setEnabled: () => {},
  toggle: () => {},
})

export function GestureProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const toggle = () => setEnabled((e) => !e)
  return (
    <GestureContext.Provider value={{ enabled, setEnabled, toggle }}>
      {children}
    </GestureContext.Provider>
  )
}

export function useGesture() {
  return useContext(GestureContext)
}
