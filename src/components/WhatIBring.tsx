import { content } from '#/content'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

// "What I bring", kept short: what I'm good at, then the stack.
// The stack leaves out anything another item already says: knowing Flask
// means knowing Python, Spring Boot means Java, NestJS means TypeScript and
// Node.js. Those languages get one quiet line instead of their own chips.

/** What each item implies, so the implied one can be left out. */
const IMPLIES: Record<string, Array<string>> = {
  Flask: ['Python', 'REST APIs'],
  Django: ['Python', 'REST APIs'],
  'Spring Boot': ['Java', 'REST APIs'],
  NestJS: ['TypeScript', 'JavaScript', 'Node.js', 'REST APIs'],
  'Node.js': ['JavaScript'],
  Angular: ['TypeScript', 'JavaScript'],
  React: ['JavaScript'],
  Vue: ['JavaScript'],
  TypeScript: ['JavaScript'],
}
/** Taken for granted for any engineer, so not worth a chip. */
const ASSUMED = new Set(['Git'])

function leanStack(tools: typeof content.resume.tools) {
  const all = tools.flatMap((g) => g.items)
  const implied = new Set(all.flatMap((t) => IMPLIES[t] ?? []))
  const keep = (t: string) => !implied.has(t) && !ASSUMED.has(t)
  const groups = tools.map((g) => ({ group: g.group, items: g.items.filter(keep) })).filter((g) => g.items.length)
  const languages = all.filter((t) => implied.has(t) && tools.some((g) => /lang/i.test(g.group) && g.items.includes(t)))
  return { groups, languages }
}

const list = (xs: Array<string>) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

export function WhatIBring() {
  const { skills, tools } = content.resume
  const { groups, languages } = leanStack(tools)
  return (
    <div className="bring">
      <ol className="bring-strengths">
        {skills.map((s, i) => (
          <Reveal as="li" key={s.name} delay={(i % 3) * 60} className="bring-strength">
            <span className="bring-index">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.name}</h3>
            <p>{s.detail}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="bring-stack">
        <p className="bring-stack-title">Stack</p>
        <dl className="bring-rows">
          {groups.map((g) => (
            <div key={g.group} className="bring-row">
              <dt>{g.group}</dt>
              <dd>
                <ul className="bring-chips">
                  {g.items.map((t) => (
                    <li key={t}><TechIcon name={t} size={16} /> {t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        {languages.length > 0 && <p className="bring-note">{list(languages)} come with these.</p>}
      </Reveal>
    </div>
  )
}
