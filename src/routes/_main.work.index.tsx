import { createFileRoute, Link } from '@tanstack/react-router'
import { ilike, inArray, or, useLiveQuery } from '@tanstack/react-db'
import { z } from 'zod'
import { content } from '#/content'
import { projectsCollection } from '#/db/collections'
import { Icon } from '#/components/Icon'
import { Reveal } from '#/components/Reveal'
import { MiniCard } from '#/components/ProjectCard'

export const Route = createFileRoute('/_main/work/')({
  validateSearch: z.object({
    tag: z.string().optional(),
    q: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: `Work · ${content.profile.name}` }] }),
  component: WorkIndex,
})


function WorkIndex() {
  const { tag, q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data: projects } = useLiveQuery({
    query: (qb) => {
      let query = qb.from({ p: projectsCollection })
      if (tag) query = query.where(({ p }) => inArray(tag, p.tags))
      if (q) {
        const pattern = `%${q}%`
        query = query.where(({ p }) =>
          or(ilike(p.title, pattern), ilike(p.summary, pattern), ilike(p.language, pattern)),
        )
      }
      return query.orderBy(({ p }) => p.featured, 'desc').orderBy(({ p }) => p.year, 'desc')
    },
  })

  const topics = [...new Set(content.projects.flatMap((p) => p.tags))].sort()

  return (
    <main className="page">
      <div className="page-hero">
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <p className="eyebrow">Work</p>
            <h1 className="page-title">Everything I’ve <span className="grad-text">built</span>.</h1>
            <p className="hero-sub">Products, features and case studies — search or filter by topic.</p>
          </Reveal>
        </div>
      </div>

      <div className="container">
        <div className="toolbar">
          <label className="search">
            <Icon name="search" />
            <input
              value={q ?? ''}
              onChange={(e) =>
                navigate({ search: (prev) => ({ ...prev, q: e.target.value || undefined }), replace: true })
              }
              placeholder="Search projects…"
              aria-label="Search projects"
            />
          </label>
        </div>

        <div className="topic-row" aria-label="Topics">
          {topics.map((t) => (
            <Link
              key={t}
              to="/work"
              search={(prev) => ({ ...prev, tag: tag === t ? undefined : t })}
              activeProps={{}}
              className={`chip ${tag === t ? 'on' : ''}`}
            >
              {t}
            </Link>
          ))}
        </div>

        {projects.length ? (
          <div className="mini-grid work-grid">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 6) * 60}>
                <MiniCard project={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>Nothing matches that filter.</p>
            <Link to="/work" className="text-link">Clear filters</Link>
          </div>
        )}
      </div>
    </main>
  )
}
