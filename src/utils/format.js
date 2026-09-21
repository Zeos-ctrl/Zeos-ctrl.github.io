// Turn an ISO date string ("2026-01-15") into "January 15, 2026".
export function formatDate(iso) {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
