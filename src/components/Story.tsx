import { useEffect, useRef } from 'react'
import { content } from '#/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'
import { OrgLogo, duration, label, monthsBetween } from './Experience'

// "My story": a centred timeline that starts with today's role and walks
// back through every role and degree to where it began. Each chapter has a
// story on one side (label, headline, text, how long it lasted) and a card
// for the role or degree on the other; sides alternate down the page.

type Chapter = {
  key: string
  mark: string
  kicker: string
  headline: string
  text: string
  metric: string
  metricLabel: string
  current: boolean
  card: {
    logo: string
    color: string
    org: string
    title: string
    meta: string
    skills: Array<string>
    promotion: boolean
    study: boolean
  }
}

const city = (loc: string) => loc.split(',')[0]?.trim() ?? ''
const year = (ym: string) => ym.slice(0, 4)

function buildChapters(): Array<Chapter> {
  const { experience, education } = content.resume

  const work: Array<Chapter> = experience
    .flatMap((c) => c.roles.map((r) => ({ c, r })))
    .sort((a, b) => b.r.start.localeCompare(a.r.start))
    .map(({ c, r }) => {
      const current = !r.end
      return {
        key: `${c.company}-${r.title}-${r.start}`,
        mark: current ? 'Now' : label(r.start),
        kicker: [c.employmentType, city(c.location), c.workplace].filter(Boolean).join(' · '),
        headline: r.headline || r.title,
        text: r.summary,
        metric: duration(monthsBetween(r.start, r.end)),
        metricLabel: current ? `since ${label(r.start)}, and counting` : `${label(r.start)} – ${label(r.end)}`,
        current,
        card: {
          logo: c.logo,
          color: c.color,
          org: c.company,
          title: r.title,
          meta: `${label(r.start)} – ${label(r.end)}`,
          skills: r.skills,
          promotion: r.promotion,
          study: false,
        },
      }
    })

  const study: Array<Chapter> = [...education]
    .sort((a, b) => b.start.localeCompare(a.start))
    .map((e) => ({
      key: `${e.school}-${e.degree}`,
      mark: year(e.start),
      kicker: ['Education', city(e.location)].filter(Boolean).join(' · '),
      headline: e.headline || e.degree,
      text: e.summary,
      metric: duration(monthsBetween(e.start, e.end)),
      metricLabel: `${year(e.start)} – ${e.end ? year(e.end) : 'Present'}`,
      current: !e.end,
      card: {
        logo: e.logo,
        color: e.color,
        org: e.school,
        title: e.degree,
        meta: [e.field, e.grade && `Grade ${e.grade}`].filter(Boolean).join(' · '),
        skills: e.skills,
        promotion: false,
        study: true,
      },
    }))

  return [...work, ...study]
}

function ChapterCard({ ch }: { ch: Chapter }) {
  const { card } = ch
  return (
    <div className="story-card">
      <div className="story-card-head">
        <OrgLogo name={card.org} logo={card.logo} color={card.color} />
        <div className="story-card-org">
          <p className="story-card-name">{card.org}</p>
          <p className="story-card-type">
            <Icon name={card.study ? 'mortarboard' : 'briefcase'} size={13} /> {card.study ? 'Education' : 'Role'}
          </p>
        </div>
        {ch.current && <span className="story-live"><span aria-hidden="true" /> Current</span>}
      </div>
      <p className="story-card-title">
        {card.title}
        {card.promotion && <span className="promo"><Icon name="arrowUp" size={12} /> Promoted</span>}
      </p>
      {card.meta && <p className="story-card-meta">{card.meta}</p>}
      {card.skills.length > 0 && (
        <ul className="story-card-skills">
          {card.skills.map((s) => (
            <li key={s}><TechIcon name={s} size={13} /> {s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// The line fills with colour as you scroll down the story, and each date
// lights up once the fill reaches it. The point that counts as "reached" is
// a little above the middle of the screen, where your eye is when reading.
function useStoryProgress() {
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const list = ref.current
    if (!list) return
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.55
      const box = list.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (line - box.top) / box.height))
      list.style.setProperty('--story-progress', progress.toFixed(4))
      list.querySelectorAll<HTMLElement>('.story-mark').forEach((mark) => {
        const r = mark.getBoundingClientRect()
        mark.closest('li')?.classList.toggle('is-reached', r.top + r.height / 2 <= line)
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  return ref
}

export function Story() {
  const chapters = buildChapters()
  const ref = useStoryProgress()
  return (
    <ol className="story" ref={ref}>
      {chapters.map((ch, i) => (
        <li key={ch.key} className={`story-chapter ${i % 2 ? 'is-flip' : ''} ${ch.current ? 'is-current' : ''}`}>
          <Reveal className="story-text">
            <p className="story-kicker">
              <span>{String(i + 1).padStart(2, '0')}</span> · {ch.kicker}
            </p>
            <h3 className="story-headline">{ch.headline}</h3>
            {ch.text && <p className="story-body">{ch.text}</p>}
            <div className="story-metric">
              <span className="story-metric-value">{ch.metric}</span>
              <span className="story-metric-label">{ch.metricLabel}</span>
            </div>
          </Reveal>
          <div className="story-mark" aria-hidden="true"><span>{ch.mark}</span></div>
          <Reveal delay={80} className="story-visual">
            <ChapterCard ch={ch} />
          </Reveal>
        </li>
      ))}
      <li className="story-end" aria-hidden="true"><span>Where it began</span></li>
    </ol>
  )
}
