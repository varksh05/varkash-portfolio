import { useEffect, useState } from 'react'

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 2000
const GAP_MS = 350

// Types each phrase, pauses, deletes it, and moves on to the next.
// The first phrase is rendered in full on the server, so the headline
// reads correctly before JavaScript loads. A hidden copy of the longest
// phrase reserves the space so the layout never jumps.
export function Typewriter({ phrases, className = '' }: { phrases: Array<string>; className?: string }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(phrases[0] ?? '')
  const [phase, setPhase] = useState<'hold' | 'delete' | 'type'>('hold')
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAnimate(!reduced && phrases.length > 1)
  }, [phrases.length])

  useEffect(() => {
    if (!animate) return
    const current = phrases[index]!
    let t: ReturnType<typeof setTimeout>
    if (phase === 'hold') {
      t = setTimeout(() => setPhase('delete'), HOLD_MS)
    } else if (phase === 'delete') {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), DELETE_MS)
      else
        t = setTimeout(() => {
          setIndex((i) => (i + 1) % phrases.length)
          setPhase('type')
        }, GAP_MS)
    } else {
      if (text.length < current.length) t = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_MS)
      else setPhase('hold')
    }
    return () => clearTimeout(t)
  }, [animate, phase, text, index, phrases])

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className={`typewriter ${className}`}>
      <span className="typewriter-ghost" aria-hidden="true">{longest}</span>
      <span className="typewriter-live" aria-hidden="true">
        <span className="grad-text">{text}</span>
        {animate && <span className={`typewriter-caret ${phase === 'hold' ? 'is-idle' : ''}`} />}
      </span>
      <span className="sr-only">{phrases[0]}</span>
    </span>
  )
}
