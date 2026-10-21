import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { AnomalousMatterHero } from '@/components/Hero'
import { SECTIONS, IMMERSIVE_QUERY } from '@/data/sections'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const lenis = useLenis()
  const [immersive, setImmersive] = useState(
    () => window.matchMedia(IMMERSIVE_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(IMMERSIVE_QUERY)
    const onChange = () => setImmersive(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // If we arrived here targeting a section — from the navbar on another page
  // (router state) or a #hash — jump to it once the sections are mounted.
  // Immersive mode handles this itself: the hash is the focused page.
  useEffect(() => {
    if (immersive) return
    const target = location.state?.scrollTo || location.hash.slice(1)
    if (!target) return
    const el = document.getElementById(target)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -80, immediate: true })
    else el.scrollIntoView()
  }, [location, lenis, immersive])

  const hashId = location.hash.slice(1)
  const focusId = SECTIONS.some((s) => s.id === hashId) ? hashId : null

  return (
    <>
      <div className="full-bleed">
        <AnomalousMatterHero
          title=""
          subtitle=""
          description=""
          immersive={immersive}
          focusId={immersive ? focusId : null}
          onSelect={(id) => navigate({ hash: id })}
          onClose={() => navigate({ hash: '' })}
        />
      </div>

      {!immersive &&
        SECTIONS.map(({ id, Component }) => <Component key={id} />)}
    </>
  )
}
