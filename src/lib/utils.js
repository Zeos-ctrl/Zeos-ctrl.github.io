import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// `cn` is the shadcn/21st.dev convention for merging class names: clsx handles
// conditional classes, twMerge dedupes conflicting Tailwind utilities so the
// last one wins (e.g. cn('p-2', 'p-4') → 'p-4').
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
