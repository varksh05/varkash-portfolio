import { Link } from '@tanstack/react-router'
import type { Post } from '#/content'
import { Icon } from './Icon'
import { Rich } from './Rich'

const WPM = 200

export function readingTime(post: Post) {
  const words = post.body.join(' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / WPM))} min read`
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="post-meta">
      <span><Icon name="calendar" size={14} /> <time dateTime={post.date}>{formatDate(post.date)}</time></span>
      <span><Icon name="clock" size={14} /> {readingTime(post)}</span>
    </p>
  )
}

// Card used in the home page "Writing" bento. `large` adds a gradient cover.
export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const [a, b] = post.cover.colors
  return (
    <article
      className={`post-card spot ${large ? 'is-large' : ''}`}
      style={{ ['--c1' as string]: a, ['--c2' as string]: b }}
    >
      {large && (
        <div className="post-card-cover" aria-hidden="true">
          <span className="post-card-cover-tags">
            {post.tags.map((t) => <span key={t}>{t}</span>)}
          </span>
        </div>
      )}
      <div className="post-card-body">
        {!large && <p className="post-kicker">{post.tags.join(' · ')}</p>}
        <h3>
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="stretched">
            {post.title}
          </Link>
        </h3>
        <p className="card-desc">{post.excerpt}</p>
        <div className="post-card-foot">
          <PostMeta post={post} />
          <span className="post-arrow" aria-hidden="true"><Icon name="external" size={16} /></span>
        </div>
      </div>
    </article>
  )
}

// Renders a post body: paragraphs, "## " headings, "> " quotes,
// consecutive "- " lines as a list, and ```lang code``` blocks.
export function PostBody({ body }: { body: Array<string> }) {
  const out: Array<React.ReactNode> = []
  let list: Array<string> = []
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`l${out.length}`}>
          {list.map((li, i) => <li key={i}><Rich text={li} /></li>)}
        </ul>,
      )
      list = []
    }
  }
  body.forEach((block, i) => {
    if (block.startsWith('- ')) {
      list.push(block.slice(2))
      return
    }
    flush()
    if (block.startsWith('## ')) out.push(<h2 key={i}>{block.slice(3)}</h2>)
    else if (block.startsWith('> ')) out.push(<blockquote key={i}><Rich text={block.slice(2)} /></blockquote>)
    else if (block.startsWith('```')) {
      const [first, ...rest] = block.replace(/```\s*$/, '').split('\n')
      const lang = first.slice(3).trim()
      out.push(
        <pre key={i} data-lang={lang || undefined}>
          <code>{rest.join('\n')}</code>
        </pre>,
      )
    } else out.push(<p key={i}><Rich text={block} /></p>)
  })
  flush()
  return <div className="prose">{out}</div>
}

// Large card for the newest post at the top of /blog.
export function FeaturedPost({ post }: { post: Post }) {
  const [a, b] = post.cover.colors
  return (
    <article className="featured-post spot" style={{ ['--c1' as string]: a, ['--c2' as string]: b }}>
      <div className="featured-cover" aria-hidden="true">
        <span className="featured-badge">Latest</span>
        <span className="featured-mark">{post.title}</span>
      </div>
      <div className="featured-body">
        <PostMeta post={post} />
        <h2>
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="stretched">
            {post.title}
          </Link>
        </h2>
        <p className="card-desc">{post.excerpt}</p>
        <div className="post-card-foot">
          <div className="post-tags">
            {post.tags.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <span className="card-cta">Read article <Icon name="arrowRight" /></span>
        </div>
      </div>
    </article>
  )
}

// Compact list row: date column, then title / excerpt / tags.
export function PostRow({ post }: { post: Post }) {
  const d = new Date(`${post.date}T00:00:00Z`)
  return (
    <li className="post-row spot" style={{ ['--c1' as string]: post.cover.colors[0], ['--c2' as string]: post.cover.colors[1] }}>
      <time className="post-row-date" dateTime={post.date}>
        <span className="post-row-day">{d.getUTCDate()}</span>
        <span>{d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>
      </time>
      <div className="post-row-main">
        <h3>
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="stretched">
            {post.title}
          </Link>
        </h3>
        <p className="card-desc">{post.excerpt}</p>
        <div className="post-row-meta">
          <span className="post-meta-inline"><Icon name="clock" size={13} /> {readingTime(post)}</span>
          {post.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      </div>
      <Icon name="arrowRight" size={18} className="post-row-arrow" />
    </li>
  )
}
