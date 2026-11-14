import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

// Centred section heading: a small accent label, the title and an
// optional intro line.
export function SectionHead({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal className="section-head">
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {children && <p className="section-sub">{children}</p>}
    </Reveal>
  )
}
