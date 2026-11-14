import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { content } from '#/content'
import { postsCollection, projectsCollection } from '#/db/collections'
import { Icon } from '#/components/Icon'
import { SocialIcon } from '#/components/SocialIcon'
import { Reveal } from '#/components/Reveal'
import { SectionHead } from '#/components/SectionHead'
import { Story } from '#/components/Story'
import { FeatureCard } from '#/components/ProjectCard'
import { PostCard } from '#/components/Blog'
import { ContactForm } from '#/components/ContactForm'
import { IdCard } from '#/components/IdCard'
import { TechIcon, techColor, techLogo } from '#/components/TechIcon'
import { Typewriter } from '#/components/Typewriter'

// The email address, large, with a button that copies it.
function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }
  return (
    <div className="contact-email">
      <a href={`mailto:${email}`}>{email}</a>
      <button type="button" className="copy-btn" onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'} title={copied ? 'Copied!' : 'Copy'}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
      </button>
    </div>
  )
}

export const Route = createFileRoute('/_main/')({
  component: Landing,
})

function Landing() {
  const { profile, hero, stats, resume, contact } = content

  const { data: featured } = useLiveQuery({
    query: (q) =>
      q
        .from({ p: projectsCollection })
        .where(({ p }) => eq(p.featured, true))
        .orderBy(({ p }) => p.year, 'desc'),
  })
  const { data: latestPosts } = useLiveQuery({
    query: (q) =>
      q
        .from({ p: postsCollection })
        .orderBy(({ p }) => p.date, 'desc')
        .limit(3),
  })

  // the strip shows logos only, so keep the tools that have a brand logo
  // (general skills like "Frontend architecture" would be unreadable icons)
  const toolbox = [...new Set(resume.tools.flatMap((g) => g.items))].filter((t) => techLogo(t))

  return (
    <>
    <main>
      {/* ── Hero ── */}
      <section id="top" className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal delay={80}>
              <h1 className="hero-title">
                {hero.title} <Typewriter phrases={hero.highlights} />
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="hero-sub">{hero.subtitle}</p>
            </Reveal>
            <Reveal delay={240} className="hero-ctas">
              <Link to="/work" className="btn btn-light btn-lg">
                View my work <Icon name="arrowRight" size={18} />
              </Link>
              <a href={profile.resumeUrl} className="btn btn-ghost btn-lg" download>
                <Icon name="download" size={18} /> Download resume
              </a>
            </Reveal>
          </div>

          <Reveal delay={200} className="hero-visual">
            <IdCard />
          </Reveal>
        </div>

        {/* ── Stats (part of the first screen) ── */}
        <div className="container hero-stats">
          <section className="stats" aria-label="Highlights">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="stat">
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </Reveal>
            ))}
          </section>
        </div>

        {/* ── Toolbox strip (part of the first screen) ── */}
        <Reveal delay={320} className="container hero-tools">
          <p className="hero-tools-label">Tools &amp; skills I work with</p>
          <div className="marquee" aria-label="Toolbox">
            <div className="marquee-track">
              {[...toolbox, ...toolbox].map((t, i) => (
                <span
                  key={i}
                  className="marquee-item"
                  title={t}
                  aria-hidden={i >= toolbox.length}
                  style={{ ['--brand' as string]: techColor(t) ?? 'var(--accent)' }}
                >
                  <TechIcon name={t} size={30} />
                  <span className="sr-only">{t}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <div className="container sections">
        {/* ── Story: today's role back to the classroom ── */}
        <section id="experience" className="block">
          <SectionHead eyebrow="My story" title="Where I am, and how I got here.">
            Starting with what I do today and walking back, role by role, to where it began.
          </SectionHead>
          <Story />
          <Reveal className="section-more">
            <Link to="/resume" className="text-link">Full resume <Icon name="arrowRight" /></Link>
          </Reveal>
        </section>

        {/* ── Selected work ── */}
        <section id="work" className="block">
          <SectionHead eyebrow="Selected work" title="Things I’ve built and shipped.">
            A few projects I’m proud of — what the problem was, what I built, and what changed.
          </SectionHead>
          <div className="feature-grid">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <FeatureCard project={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="section-more">
            <Link to="/work" className="text-link">See all projects <Icon name="arrowRight" /></Link>
          </Reveal>
        </section>

        {/* ── Writing ── */}
        {latestPosts.length > 0 && (
          <section id="blog" className="block">
            <SectionHead eyebrow="Writing" title="Notes on building software.">
              Lessons from shipping products — engineering, design and the bits in between.
            </SectionHead>
            <div className="writing-grid">
              {latestPosts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80} className={i === 0 ? 'writing-main' : 'writing-side'}>
                  <PostCard post={p} large={i === 0} />
                </Reveal>
              ))}
            </div>
            <Reveal className="section-more">
              <Link to="/blog" className="text-link">All posts <Icon name="arrowRight" /></Link>
            </Reveal>
          </section>
        )}

      </div>

      {/* ── Contact: the last screen ── */}
      <section id="contact" className="slide-contact">

      <div className="container sections">
        <div className="block contact-block">
          <SectionHead eyebrow="Contact" title={contact.heading}>
            {contact.blurb}
          </SectionHead>
          <Reveal className="contact-panel">
            <div className="contact-aside">
              <p className="contact-eyebrow">Prefer email?</p>
              <CopyEmail email={profile.email} />
              <p className="contact-fact"><Icon name="location" size={16} /> {profile.location} · IST (UTC+5:30)</p>
              <div className="contact-socials">
                {profile.socials.map((s) => (
                  <a key={s.label} className="contact-social" href={s.url} target="_blank" rel="noreferrer">
                    <SocialIcon label={s.label} size={18} /> {s.label}
                    <Icon name="external" size={14} className="contact-arrow" />
                  </a>
                ))}
              </div>
            </div>
            <div className="contact-main">
              <p className="contact-main-title">Send a message</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
      </section>
    </main>
    </>
  )
}
