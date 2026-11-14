import { useEffect } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Nav } from '#/components/Nav'
import { Footer } from '#/components/Footer'

// Site shell: sticky nav, page, footer. Also drives the "spotlight" glow
// that follows the pointer across any `.spot` card.
export const Route = createFileRoute('/_main')({
  component: Shell,
})

function Shell() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>('.spot')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="site">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  )
}
