import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { eq, not, useLiveQuery } from '@tanstack/react-db'
import { content } from '#/content'
import { projectsCollection } from '#/db/collections'
import { Rich } from '#/components/Rich'
import { Icon } from '#/components/Icon'
import { Reveal } from '#/components/Reveal'
import { Cover, LanguageTag, MiniCard } from '#/components/ProjectCard'

export const Route = createFileRoute('/_main/work/$slug')({
  loader: ({ params }) => {
    const project = projectsCollection.get(params.slug)
    if (!project) throw notFound()
    return { title: project.title, summary: project.summary }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · ${content.profile.name}` },
          { name: 'description', content: loaderData.summary },
        ]
      : [],
  }),
  component: CaseStudy,
})

function CaseStudy() {
  const { slug } = Route.useParams()
  const { data: p } = useLiveQuery({
    query: (q) => q.from({ p: projectsCollection }).where(({ p }) => eq(p.slug, slug)).findOne(),
  })
  const { data: more } = useLiveQuery({
    query: (q) =>
      q
        .from({ p: projectsCollection })
        .where(({ p }) => not(eq(p.slug, slug)))
        .orderBy(({ p }) => p.year, 'desc')
        .limit(3),
  })
  if (!p) return null

  return (
    <main className="page">
      <div className="page-hero case-hero">
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="container case-narrow">
          <Reveal>
            <Link to="/work" className="back-link">
              <Icon name="arrowLeft" /> All work
            </Link>
            <div className="card-meta case-meta">
              <LanguageTag language={p.language} />
              <span>{p.year}</span>
            </div>
            <h1 className="page-title">{p.title}</h1>
            <p className="hero-sub">{p.summary}</p>
            {p.links.length > 0 && (
              <div className="hero-ctas">
                {p.links.map((l, i) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn btn-lg ${i === 0 ? 'btn-light' : 'btn-ghost'}`}
                  >
                    {l.label} <Icon name="external" />
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <div className="container case-narrow">
        <Reveal>
          <Cover project={p} className="cover-xl" />
        </Reveal>

        {(p.meta.length > 0 || p.metrics.length > 0) && (
          <Reveal className="facts">
            {p.metrics.map((m) => (
              <div key={m.label} className="fact fact-big">
                <p className="stat-value">{m.value}</p>
                <p className="stat-label">{m.label}</p>
              </div>
            ))}
            {p.meta.map((m) => (
              <div key={m.label} className="fact">
                <p className="eyebrow">{m.label}</p>
                <p>{m.value}</p>
              </div>
            ))}
          </Reveal>
        )}

        <div className="case-body">
          {p.sections.map((s) => (
            <Reveal as="section" key={s.heading} className="case-section">
              <h2>{s.heading}</h2>
              <p><Rich text={s.body} /></p>
            </Reveal>
          ))}
          {p.tags.length > 0 && (
            <div className="topic-row">
              {p.tags.map((t) => (
                <Link key={t} to="/work" search={{ tag: t }} className="chip">{t}</Link>
              ))}
            </div>
          )}
        </div>

        {more.length > 0 && (
          <section className="more">
            <h2 className="eyebrow">More work</h2>
            <div className="mini-grid">
              {more.map((m) => <MiniCard key={m.slug} project={m} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
