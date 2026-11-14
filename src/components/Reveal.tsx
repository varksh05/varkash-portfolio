import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

// useLayoutEffect warns during server rendering; it only matters in the browser
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// A quick, subtle fade-in as content scrolls into view. It starts a little
// before the element reaches the screen, so it is usually done by the time
// you see it, and anything already on screen shows at once (no fade).
export function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
}: {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'hidden' | 'in' | 'instant'>('hidden')

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return setState('instant')
    // already on screen when it mounts: show it straight away
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) return setState('instant')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px 160px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // keep any stagger short so groups don't trickle in
  const d = Math.min(delay * 0.5, 90)
  return (
    <Tag
      ref={ref}
      className={`reveal ${state === 'hidden' ? '' : 'in'} ${state === 'instant' ? 'instant' : ''} ${className}`}
      style={d && state === 'in' ? { transitionDelay: `${d}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
