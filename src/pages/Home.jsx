import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { AnomalousMatterHero } from '@/components/Hero'
import DirectiveSection from '@/components/sections/DirectiveSection.jsx'
import ProjectsSection from '@/components/sections/ProjectsSection.jsx'
import ResearchSection from '@/components/sections/ResearchSection.jsx'
import AboutSection from '@/components/sections/AboutSection.jsx'

export default function Home() {
  const location = useLocation()
  const lenis = useLenis()

  // If we arrived here targeting a section — from the navbar on another page
  // (router state) or a #hash — jump to it once the sections are mounted.
  useEffect(() => {
    const target = location.state?.scrollTo || location.hash.slice(1)
    if (!target) return
    const el = document.getElementById(target)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -80, immediate: true })
    else el.scrollIntoView()
  }, [location, lenis])

  return (
    <>
      <div className="full-bleed">
        <AnomalousMatterHero
          title=""
          subtitle=""
          description=""
        />
      </div>

      <DirectiveSection />
      <AboutSection />
      <ProjectsSection />
      <ResearchSection />
    </>
  )
}
