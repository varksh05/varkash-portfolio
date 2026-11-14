import { useRef, useState, type MouseEvent } from 'react'
import { content } from '#/content'
import { Icon } from './Icon'
import { SocialIcon } from './SocialIcon'
import { TechIcon } from './TechIcon'

// Brand colours for the social links on the pass.
function brandColor(label: string) {
  const l = label.toLowerCase()
  if (l.includes('github')) return '#181717'
  if (l.includes('linkedin')) return '#0a66c2'
  if (l === 'x' || l.includes('twitter')) return '#000000'
  return 'var(--accent)'
}

// Total experience from the earliest role start to today, e.g. "5+ years".
function experienceYears() {
  const starts = content.resume.experience.flatMap((c) => c.roles.map((r) => r.start)).sort()
  if (!starts.length) return ''
  const [y, m] = starts[0]!.split('-').map(Number)
  const now = new Date()
  const months = (now.getFullYear() - y!) * 12 + (now.getMonth() + 1 - m!)
  const years = Math.floor(months / 12)
  return years < 1 ? `${months} months` : `${years}${months % 12 ? '+' : ''} year${years > 1 ? 's' : ''}`
}

// "Master of Computer Applications (MCA)" → "MCA"
const shortDegree = (degree: string) => degree.match(/\(([^)]+)\)/)?.[1] ?? degree

// Brand tints for the stack icons on the dark back (light enough to read).
function toolColor(name: string) {
  const n = name.toLowerCase()
  if (n.includes('react')) return '#61dafb'
  if (n.includes('nest')) return '#ea2845'
  if (n.includes('node')) return '#7cc35a'
  if (n.includes('python')) return '#ffd43b'
  if (n.includes('typescript')) return '#5b9cf0'
  if (n.includes('javascript')) return '#f7df1e'
  return '#f5f5f7'
}

// A standalone pass card for the hero, in the spirit of an event pass:
// frosted surface with soft iridescent colour, no logos. It stays still (it
// doesn't follow the mouse); clicking the card or the flip button turns it
// over to a dark back with a quick snapshot for recruiters.
export function IdCard() {
  const { profile, idCard, resume } = content
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState(false)

  const flip = () => setFlipped((f) => !f)
  // links on the card shouldn't also flip it
  const stop = (e: MouseEvent) => e.stopPropagation()
  // the company with a role that hasn't ended
  const current = resume.experience.find((c) => c.roles.some((r) => !r.end))
  const currentRole = current?.roles.find((r) => !r.end)
  const edu = resume.education[0]
  const socials = [
    ...profile.socials.map((s) => ({ label: s.label, url: s.url, color: brandColor(s.label) })),
    {
      label: 'Email (Gmail)',
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`,
      color: '#ea4335',
    },
  ]

  return (
    <div className="idc-wrap" ref={wrap}>
      <div className="idc-tilt">
        <div className="idc-track" ref={track}>
          <div className={`idc ${flipped ? 'is-flipped' : ''}`} onClick={flip}>
            {/* ── Front ── */}
            <div className="idc-face idc-front" aria-hidden={flipped}>
              <div className="idc-top">
                {current && (
                  <p className="idc-company">
                    <span className="idc-co-logo" style={{ ['--co' as string]: current.color }} aria-hidden="true">
                      {current.logo ? <img src={current.logo} alt="" /> : current.company[0]}
                    </span>
                    <span>{current.company}</span>
                  </p>
                )}
              </div>

              <div className="idc-ident">
                <div className="idc-photo">
                  {profile.avatar ? <img src={profile.avatar} alt="" /> : <span>{profile.initials}</span>}
                </div>
                <div className="idc-who">
                  <p className="idc-name">{profile.name}</p>
                  <p className="idc-role">{profile.role}</p>
                </div>
              </div>

              <div className="idc-socials" aria-label="Find me online">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="idc-social"
                    aria-label={s.label}
                    title={s.label}
                    tabIndex={flipped ? -1 : undefined}
                    style={{ ['--brand' as string]: s.color }}
                    onClick={stop}
                  >
                    <SocialIcon label={s.label} size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Back: a quick snapshot for recruiters ── */}
            <div className="idc-face idc-back" aria-hidden={!flipped}>
              <div className="idc-top">
                <span className="idc-label">For recruiters</span>
                {profile.status && (
                  <span className="idc-status"><span className="idc-status-dot" aria-hidden="true" />{profile.status}</span>
                )}
              </div>
              <dl className="idc-hr">
                <div><dt>Experience</dt><dd>{experienceYears()}</dd></div>
                {current && currentRole && (
                  <div><dt>Currently</dt><dd>{currentRole.title} · {current.company}</dd></div>
                )}
                {idCard.openTo && <div><dt>Open to</dt><dd>{idCard.openTo}</dd></div>}
                {edu && <div><dt>Education</dt><dd>{shortDegree(edu.degree)}, {edu.school}</dd></div>}
              </dl>
              {idCard.stack.length > 0 && (
                <ul className="idc-stack" aria-label="Core stack">
                  {idCard.stack.map((t) => (
                    <li key={t} title={t} style={{ ['--tool' as string]: toolColor(t) }}>
                      <TechIcon name={t} size={17} />
                      <span className="sr-only">{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={`idc-flip hover-solid ${flipped ? 'is-flipped' : ''}`}
        onClick={flip}
        aria-pressed={flipped}
        aria-label={flipped ? 'Flip card to the front' : 'Flip card to the back'}
        title="Flip card"
      >
        <Icon name="flip" size={18} variant="swap" />
      </button>
    </div>
  )
}
