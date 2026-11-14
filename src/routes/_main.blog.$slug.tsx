import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { content } from '#/content'
import { postsCollection } from '#/db/collections'
import { Icon } from '#/components/Icon'
import { Reveal } from '#/components/Reveal'
import { PostBody, PostMeta } from '#/components/Blog'

export const Route = createFileRoute('/_main/blog/$slug')({
  loader: ({ params }) => {
    const post = postsCollection.get(params.slug)
    if (!post) throw notFound()
    return { title: post.title, excerpt: post.excerpt }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · ${content.profile.name}` },
          { name: 'description', content: loaderData.excerpt },
        ]
      : [],
  }),
  component: Article,
})

function Article() {
  const { slug } = Route.useParams()
  const { profile } = content
  const { data: post } = useLiveQuery({
    query: (q) => q.from({ p: postsCollection }).where(({ p }) => eq(p.slug, slug)).findOne(),
  })
  const { data: all } = useLiveQuery({
    query: (q) => q.from({ p: postsCollection }).orderBy(({ p }) => p.date, 'desc'),
  })
  if (!post) return null

  const i = all.findIndex((p) => p.slug === slug)
  const newer = i > 0 ? all[i - 1] : undefined
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : undefined
  const [a, b] = post.cover.colors

  return (
    <main className="page">
      <div className="page-hero article-hero" style={{ ['--c1' as string]: a, ['--c2' as string]: b }}>
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="container article-narrow">
          <Reveal>
            <Link to="/blog" className="back-link"><Icon name="arrowLeft" /> All posts</Link>
            <PostMeta post={post} />
            <h1 className="page-title article-title">{post.title}</h1>
            <p className="hero-sub">{post.excerpt}</p>
            <div className="article-byline">
              <span className="brand-mark">{profile.initials}</span>
              <span>
                <strong>{profile.name}</strong>
                <span className="fg-muted"> · {profile.role}</span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container article-narrow">
        <span className="article-bar" style={{ ['--c1' as string]: a, ['--c2' as string]: b }} aria-hidden="true" />
        <Reveal>
          <PostBody body={post.body} />
        </Reveal>

        {post.tags.length > 0 && (
          <div className="topic-row">
            {post.tags.map((t) => (
              <Link key={t} to="/blog" search={{ tag: t }} className="chip">{t}</Link>
            ))}
          </div>
        )}

        {(newer || older) && (
          <nav className="post-nav" aria-label="More posts">
            {older ? (
              <Link to="/blog/$slug" params={{ slug: older.slug }} className="post-nav-link">
                <span className="eyebrow"><Icon name="arrowLeft" size={12} /> Older</span>
                <span>{older.title}</span>
              </Link>
            ) : <span />}
            {newer && (
              <Link to="/blog/$slug" params={{ slug: newer.slug }} className="post-nav-link post-nav-next">
                <span className="eyebrow">Newer <Icon name="arrowRight" size={12} /></span>
                <span>{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  )
}
