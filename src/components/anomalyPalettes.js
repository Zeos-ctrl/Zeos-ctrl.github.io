// Anomaly color palettes. "default" keeps the current single color; "ember"
// uses the orange shades from the footer gradient (deep → bright), blended
// across the surface by lighting intensity.
//
// Kept in its own module (not Hero.jsx) so Hero.jsx exports only components —
// otherwise Vite disables Fast Refresh for the file.
export const ANOMALY_PALETTES = {
  default: { low: '#ffffff', high: '#ffffff' },
  ember: { low: '#3D0A05', high: '#FF9033' },
}
