import { createFileRoute, Link } from '@tanstack/react-router'
import { ilike, inArray, or, useLiveQuery } from '@tanstack/react-db'
import { z } from 'zod'
import { content } from '#/content'
import { postsCollection } from '#/db/collections'
import { Icon } from '#/components/Icon'
import { Reveal } from '#/components/Reveal'
import { FeaturedPost, PostRow } from '#/components/Blog'

export const Route = createFileRoute('/_main/blog/')({
  validateSearch: z.object({ tag: z.string().optional(), q: z.string().optional() }),
  head: () => ({ meta: [{ title: `Blog · ${content.profile.name}` }] }),
  component: BlogIndex,
})

function BlogIndex() {
  const { tag, q } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data: posts } = useLiveQuery({
    query: (qb) => {
      let query = qb.from({ p: postsCollection })
      if (tag) query = query.where(({ p }) => inArray(tag, p.tags))
      if (q) {
        const pattern = `%${q}%`
        query = query.where(({ p }) => or(ilike(p.title, pattern), ilike(p.excerpt, pattern)))
      }
      return query.orderBy(({ p }) => p.date, 'desc')
    },
  })

  // Topics with post counts, most-used first.
  const counts = new Map<string, number>()
  for (const p of content.posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  const tags = [...counts].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))

  const filtering = !!(tag || q)
  const [featured, ...rest] = posts
  const listed = filtering ? posts : rest

  return (
    <main className="page">
      <div className="page-hero">
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="container">
          <Reveal>
            <p className="eyebrow">Blog</p>
            <h1 className="page-title">Notes on <span className="grad-text">building software</span>.</h1>
            <p className="hero-sub">Lessons from shipping products — engineering, design and the bits in between.</p>
            <p className="blog-count">
              <Icon name="quill" size={16} /> {content.posts.length} posts · {tags.length} topics
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container blog-body">
        <div className="blog-toolbar">
          <label className="search">
            <Icon name="search" />
            <input
              value={q ?? ''}
              onChange={(e) =>
                navigate({ search: (prev) => ({ ...prev, q: e.target.value || undefined }), replace: true })
              }
              placeholder="Search posts…"
              aria-label="Search posts"
            />
          </label>
          <div className="blog-topics" aria-label="Topics">
            <Link
              to="/blog"
              search={(prev) => ({ ...prev, tag: undefined })}
              activeProps={{}}
              className={`chip ${!tag ? 'on' : ''}`}
            >
              All
            </Link>
            {tags.map(([t, n]) => (
              <Link
                key={t}
                to="/blog"
                search={(prev) => ({ ...prev, tag: tag === t ? undefined : t })}
                activeProps={{}}
                className={`chip ${tag === t ? 'on' : ''}`}
              >
                {t} <span className="chip-count">{n}</span>
              </Link>
            ))}
          </div>
        </div>

        {filtering && (
          <p className="blog-results">
            {posts.length} result{posts.length === 1 ? '' : 's'}
            {tag && <> in <strong>{tag}</strong></>}
            {q && <> for “<strong>{q}</strong>”</>}
            {' · '}
            <Link to="/blog" className="inline-link">Clear</Link>
          </p>
        )}

        {!filtering && featured && (
          <Reveal>
            <FeaturedPost post={featured} />
          </Reveal>
        )}

        {listed.length > 0 && (
          <>
            {!filtering && <h2 className="blog-list-title">More posts</h2>}
            <ol className="post-list">
              {listed.map((p) => <PostRow key={p.slug} post={p} />)}
            </ol>
          </>
        )}

        {posts.length === 0 && (
          <div className="empty">
            <p>No posts match that filter.</p>
            <Link to="/blog" className="text-link">Clear filters</Link>
          </div>
        )}
      </div>
    </main>
  )
}
