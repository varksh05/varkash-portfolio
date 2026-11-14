import { Link } from '@tanstack/react-router'
import type { Project } from '#/content'
import { languageColor } from '#/lib/languages'
import { Icon } from './Icon'

export function LanguageTag({ language }: { language: string }) {
  if (!language) return null
  return (
    <span className="lang">
      <span className="lang-dot" style={{ background: languageColor(language) }} />
      {language}
    </span>
  )
}

export function Cover({ project, className = '' }: { project: Project; className?: string }) {
  const [a, b] = project.cover.colors
  return (
    <div className={`cover ${className}`} style={{ ['--c1' as string]: a, ['--c2' as string]: b }}>
      {project.cover.image ? (
        <img src={project.cover.image} alt="" loading="lazy" />
      ) : (
        <span className="cover-title">{project.title}</span>
      )}
    </div>
  )
}

// Large card used for featured work.
export function FeatureCard({ project }: { project: Project }) {
  return (
    <article className="feature-card spot">
      <Cover project={project} />
      <div className="feature-body">
        <div className="card-meta">
          <LanguageTag language={project.language} />
          <span>{project.year}</span>
        </div>
        <h3>
          <Link to="/work/$slug" params={{ slug: project.slug }} className="stretched">
            {project.title}
          </Link>
        </h3>
        <p className="card-desc">{project.summary}</p>
        {project.metrics.length > 0 && (
          <dl className="metrics">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <dd>{m.value}</dd>
                <dt>{m.label}</dt>
              </div>
            ))}
          </dl>
        )}
        <span className="card-cta">Read case study <Icon name="arrowRight" /></span>
      </div>
    </article>
  )
}

// Compact card used in the full work grid and "more work".
export function MiniCard({ project }: { project: Project }) {
  return (
    <article className="mini-card spot">
      <Icon name="external" size={18} className="mini-arrow" />
      <span
        className="mini-swatch"
        style={{ background: `linear-gradient(135deg, ${project.cover.colors[0]}, ${project.cover.colors[1]})` }}
      />
      <h3>
        <Link to="/work/$slug" params={{ slug: project.slug }} className="stretched">
          {project.title}
        </Link>
      </h3>
      <p className="card-desc">{project.summary}</p>
      <div className="card-meta">
        <LanguageTag language={project.language} />
        <span>{project.year}</span>
      </div>
    </article>
  )
}
