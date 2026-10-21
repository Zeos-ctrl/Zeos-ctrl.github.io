import DirectiveSection from '@/components/sections/DirectiveSection.jsx'
import AboutSection from '@/components/sections/AboutSection.jsx'
import ProjectsSection from '@/components/sections/ProjectsSection.jsx'
import ResearchSection from '@/components/sections/ResearchSection.jsx'

// Home-page sections, in order. Used by the navbar and by the hero, which on
// desktop floats them as pages inside the anomaly.
export const SECTIONS = [
  { id: 'directive', label: 'Directive', Component: DirectiveSection },
  { id: 'about', label: 'About', Component: AboutSection },
  { id: 'projects', label: 'Projects', Component: ProjectsSection },
  { id: 'research', label: 'Research', Component: ResearchSection },
]

// Desktop with a mouse: the immersive hero replaces the stacked sections.
export const IMMERSIVE_QUERY = '(min-width: 1024px) and (pointer: fine)'
