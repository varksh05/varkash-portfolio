import { useEffect, useRef } from 'react'

// A modern pointer (desktop only), in the spirit of the newer iPadOS
// pointer: a small rounded arrow that follows the pointer exactly. Over
// small interactive elements (buttons, nav icons, chips) and clickable
// cards it turns into a clear glass highlight that hugs the element; over
// text fields it hides so the native caret shows.
const INTERACTIVE = 'a, button, [role="button"], label, summary, select'
const TEXT_INPUT = 'input, textarea, [contenteditable="true"]'
const SNAP_MAX_W = 360
const SNAP_MAX_H = 120
const SNAP_PAD = 6
// where the arrow's tip sits inside its 24px box
const TIP = 4

type Box = { x: number; y: number; w: number; h: number; r: number }

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!fine.matches) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const dot = dotRef.current!
    const ring = ringRef.current!
    const root = document.documentElement
    root.classList.add('has-cursor')

    let px = -100, py = -100
    let target: Box = { x: px, y: py, w: 30, h: 30, r: 15 }
    const cur: Box = { ...target }
    let snapEl: HTMLElement | null = null
    let snapRadius = 8
    let state: 'idle' | 'link' | 'snap' | 'text' = 'idle'
    let pressed = false
    let visible = false
    let raf = 0

    const setState = (s: typeof state) => {
      if (s === state) return
      state = s
      ring.dataset.state = s
      dot.dataset.state = s
    }

    const compute = () => {
      const size = pressed ? 18 : state === 'link' ? 48 : 22
      if (state === 'snap' && snapEl) {
        const r = snapEl.getBoundingClientRect()
        const radius = snapRadius
        // drift slightly toward the pointer so the highlight feels alive
        // big targets (whole cards) drift much less so the outline stays put
        const drift = r.width > SNAP_MAX_W || r.height > SNAP_MAX_H ? 0.025 : 0.12
        const dx = (px - (r.left + r.width / 2)) * drift
        const dy = (py - (r.top + r.height / 2)) * drift
        const shrink = pressed ? 3 : 0
        target = {
          x: r.left - SNAP_PAD + dx + shrink,
          y: r.top - SNAP_PAD + dy + shrink,
          w: r.width + SNAP_PAD * 2 - shrink * 2,
          h: r.height + SNAP_PAD * 2 - shrink * 2,
          r: Math.min(radius + SNAP_PAD, (r.height + SNAP_PAD * 2) / 2),
        }
      } else {
        target = { x: px - size / 2, y: py - size / 2, w: size, h: size, r: size / 2 }
      }
    }

    const loop = () => {
      compute()
      // the disc is the pointer itself, so it follows closely; morphs stay springy
      const k = reduced ? 1 : state === 'snap' ? 0.22 : 0.4
      cur.x += (target.x - cur.x) * k
      cur.y += (target.y - cur.y) * k
      cur.w += (target.w - cur.w) * k
      cur.h += (target.h - cur.h) * k
      cur.r += (target.r - cur.r) * k
      ring.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      ring.style.width = `${cur.w}px`
      ring.style.height = `${cur.h}px`
      ring.style.borderRadius = `${cur.r}px`
      // keep going only while the highlight is still catching up
      const settled =
        Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) + Math.abs(target.w - cur.w) + Math.abs(target.h - cur.h) < 0.3
      raf = settled ? 0 : requestAnimationFrame(loop)
    }
    // the loop runs only while something moves, not on every frame
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const snapTo = (el: HTMLElement) => {
      if (snapEl !== el) snapRadius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 8
      snapEl = el
      setState('snap')
    }

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      // the arrow follows the pointer exactly, with its tip on the hotspot
      dot.style.transform = `translate3d(${px - TIP}px, ${py - TIP}px, 0)`
      kick()
      if (!visible) {
        visible = true
        root.classList.add('cursor-visible')
        // start from the pointer instead of flying in from the corner
        Object.assign(cur, { x: px - 11, y: py - 11 })
      }
      const t = e.target as Element | null
      if (t?.closest(TEXT_INPUT)) {
        snapEl = null
        return setState('text')
      }
      const el = t?.closest<HTMLElement>(INTERACTIVE)
      // a card made clickable by a stretched link (its ::after covers the
      // card): wrap the whole card, which is the link's positioned parent
      if (el?.classList.contains('stretched') && el.offsetParent instanceof HTMLElement) {
        return snapTo(el.offsetParent)
      }
      if (el) {
        const r = el.getBoundingClientRect()
        const inside = px >= r.left && px <= r.right && py >= r.top && py <= r.bottom
        const small = r.width <= SNAP_MAX_W && r.height <= SNAP_MAX_H
        // stretched card links cover a whole card via ::after; the pointer is
        // then outside the link's own box, so use the bigger ring instead
        if (inside && small) return snapTo(el)
        snapEl = null
        return setState('link')
      }
      snapEl = null
      setState('idle')
    }
    const onLeave = () => {
      visible = false
      root.classList.remove('cursor-visible')
    }
    const onDown = () => {
      pressed = true
      ring.classList.add('pressed')
      kick()
    }
    const onUp = () => {
      pressed = false
      ring.classList.remove('pressed')
      kick()
    }
    // scrolling moves the page under a still pointer: drop the highlight
    // (it would point at the wrong thing) until the pointer moves again
    const onScroll = () => {
      if (state !== 'snap') return
      snapEl = null
      setState('idle')
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('blur', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'cursor-visible')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-state="idle" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" data-state="idle" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M5.2 4.1c-.7-.3-1.4.4-1.1 1.1l5.9 15.1c.3.8 1.4.8 1.7 0l2.2-5.3c.1-.3.4-.6.7-.7l5.3-2.2c.8-.3.8-1.4 0-1.7L5.2 4.1z" />
        </svg>
      </div>
    </>
  )
}
