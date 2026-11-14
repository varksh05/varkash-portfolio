import { content } from '#/content'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

// LinkedIn-style experience: one card per company with its logo, total
// tenure, and the roles held there (newest first) on a small timeline.

type Company = (typeof content.resume.experience)[number]
type Role = Company['roles'][number]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parse(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return { y, m }
}
function now() {
  const d = new Date()
  return { y: d.getFullYear(), m: d.getMonth() + 1 }
}
export function label(ym: string) {
  if (!ym) return 'Present'
  const { y, m } = parse(ym)
  return `${MONTHS[m - 1]} ${y}`
}
// Inclusive month count, like LinkedIn (Jan–Jun = 6 mos).
export function monthsBetween(start: string, end: string) {
  const s = parse(start)
  const e = end ? parse(end) : now()
  return Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1)
}
export function duration(months: number) {
  const y = Math.floor(months / 12)
  const m = months % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}
function range(r: Role) {
  return `${label(r.start)} – ${label(r.end)} · ${duration(monthsBetween(r.start, r.end))}`
}
function tenure(c: Company) {
  const start = c.roles.map((r) => r.start).sort()[0]
  const current = c.roles.some((r) => !r.end)
  const end = current ? '' : c.roles.map((r) => r.end).sort().at(-1)!
  return duration(monthsBetween(start, end))
}
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

export function OrgLogo({ name, logo, color }: { name: string; logo: string; color: string }) {
  return (
    <span className="co-logo" style={{ ['--co' as string]: color }} aria-hidden="true">
      {logo ? <img src={logo} alt="" /> : <span>{initials(name)}</span>}
    </span>
  )
}

function OrgName({ name, url }: { name: string; url: string }) {
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" className="co-link">{name}</a>
  ) : (
    <>{name}</>
  )
}

const CompanyLogo = ({ c }: { c: Company }) => <OrgLogo name={c.company} logo={c.logo} color={c.color} />
const CompanyName = ({ c }: { c: Company }) => <OrgName name={c.company} url={c.url} />

function Skills({ skills }: { skills: Array<string> }) {
  if (!skills.length) return null
  return (
    <ul className="xp-skills" aria-label="Skills">
      {skills.map((s) => (
        <li key={s} className="chip chip-icon">
          <TechIcon name={s} size={14} />
          {s}
        </li>
      ))}
    </ul>
  )
}

function Promoted() {
  return (
    <span className="promo">
      <Icon name="arrowUp" size={12} /> Promoted
    </span>
  )
}

function RoleItem({ r, showDot }: { r: Role; showDot: boolean }) {
  return (
    <li className={`xp-role ${r.end ? '' : 'is-current'} ${showDot ? '' : 'no-dot'}`}>
      {showDot && <span className="xp-dot" aria-hidden="true" />}
      <div className="xp-role-top">
        <div className="xp-role-head">
          <h4>{r.title}</h4>
          {r.promotion && <Promoted />}
        </div>
        <p className="xp-when">{range(r)}</p>
      </div>
      {r.summary && <p className="xp-desc">{r.summary}</p>}
      <Skills skills={r.skills} />
    </li>
  )
}

// Two columns per company: who/where on the left, the roles held there
// (newest first, on a small timeline when there's more than one) on the right.
export function Experience() {
  const { experience } = content.resume
  return (
    <ol className="xp xp-group">
      {experience.map((c, i) => {
        const where = [c.location, c.workplace].filter(Boolean).join(' · ')
        const multi = c.roles.length > 1
        return (
          <Reveal as="li" key={c.company} delay={i * 80} className="xp-co">
            <header className="xp-co-head">
              <CompanyLogo c={c} />
              <div>
                <h3><CompanyName c={c} /></h3>
                <p className="xp-sub">{[c.employmentType, tenure(c)].filter(Boolean).join(' · ')}</p>
                {where && <p className="xp-meta">{where}</p>}
              </div>
            </header>
            <ol className={`xp-roles ${multi ? 'is-multi' : ''}`} style={{ ['--co' as string]: c.color }}>
              {c.roles.map((r) => (
                <RoleItem key={r.title + r.start} r={r} showDot={multi} />
              ))}
            </ol>
          </Reveal>
        )
      })}
    </ol>
  )
}

// Education in the same LinkedIn style: one row per school in a grouped card.
// "Studies": one card per degree, side by side. The degree leads, with its
// short form (MCA, BCA) as a badge; the school, years and length follow.
const level = (degree: string) => (/master/i.test(degree) ? "Master's" : /bachelor/i.test(degree) ? "Bachelor's" : 'Degree')
const shortForm = (degree: string) => degree.match(/\(([^)]+)\)/)?.[1]
/** Degrees read in whole years: June 2016 to April 2019 is a 3-year degree, not 2 yrs 11 mos. */
const studyYears = (start: string, end: string) => {
  const y = Math.max(1, Math.round(monthsBetween(start, end) / 12))
  return `${y}-year degree`
}
const fullName = (degree: string) => degree.replace(/\s*\([^)]*\)\s*/, '').trim()

export function Education() {
  const { education } = content.resume
  return (
    <ol className="edu-grid">
      {education.map((e, i) => (
        <Reveal as="li" key={e.school + e.degree} delay={i * 80} className="edu-card">
          <div className="edu-top">
            <OrgLogo name={e.school} logo={e.logo} color={e.color} />
            <span className="edu-level"><Icon name="mortarboard" size={13} /> {level(e.degree)}</span>
            <span className="edu-years">{e.start.slice(0, 4)} – {e.end ? e.end.slice(0, 4) : 'Present'}</span>
          </div>
          <h3 className="edu-degree">
            {fullName(e.degree)}
            {shortForm(e.degree) && <span className="edu-short">{shortForm(e.degree)}</span>}
          </h3>
          <p className="edu-school"><OrgName name={e.school} url={e.url} /></p>
          <p className="edu-meta">
            {e.location && <span><Icon name="location" size={13} /> {e.location}</span>}
            <span><Icon name="clock" size={13} /> {studyYears(e.start, e.end)}</span>
            {e.grade && <span><Icon name="mortarboard" size={13} /> Grade {e.grade}</span>}
          </p>
          {e.summary && <p className="edu-summary">{e.summary}</p>}
          {e.skills.length > 0 && <div className="edu-skills"><Skills skills={e.skills} /></div>}
        </Reveal>
      ))}
    </ol>
  )
}
