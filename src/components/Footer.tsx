import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { content } from '#/content'
import { Icon } from './Icon'
import { SocialIcon } from './SocialIcon'

export function Footer() {
  const { profile, meta, footer } = content
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <footer className="footer">
      {/* The home page already ends with a contact section, so skip the CTA there. */}
      {pathname !== '/' && (
        <div className="container">
          <div className="footer-cta">
            <div className="footer-cta-copy">
              <p className="footer-cta-eyebrow"><span aria-hidden="true" /> Let’s talk</p>
              <h2>{footer.ctaTitle}</h2>
              <p>{footer.ctaText}</p>
            </div>
            <div className="footer-cta-side">
              <div className="footer-cta-actions">
                <a href={`mailto:${profile.email}`} className="btn btn-primary btn-lg">
                  <Icon name="mail" size={18} /> Write me an email
                </a>
                <Link to="/" hash="contact" className="btn btn-lg footer-cta-secondary">
                  Contact form <Icon name="arrowRight" size={18} />
                </Link>
              </div>
              <button type="button" className="footer-cta-email" onClick={copyEmail} aria-label={copied ? 'Email copied' : `Copy ${profile.email}`}>
                {profile.email} <Icon name={copied ? 'check' : 'copy'} size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className={`brand-mark ${profile.avatar ? 'has-photo' : ''}`}>
              {profile.avatar ? <img src={profile.avatar} alt="" /> : profile.initials}
            </span>
            <span className="brand-name">{profile.name}</span>
          </Link>
          <p className="footer-tagline">{footer.tagline}</p>
        </div>
        <div className="footer-top-right">
          <div className="footer-socials">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label} className="hover-solid">
                <SocialIcon label={s.label} size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-grid">
        <nav className="footer-col" aria-label="Site">
          <p className="footer-heading">Navigate</p>
          <Link to="/">Home</Link>
          <Link to="/work">Work</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/" hash="experience">My story</Link>
          <Link to="/resume">Resume</Link>
        </nav>


        <div className="footer-col">
          <p className="footer-heading">Contact</p>
          <div className="footer-email">
            <Icon name="mail" size={14} className="footer-email-icon" />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button
              type="button"
              className="copy-btn"
              onClick={copyEmail}
              aria-label={copied ? 'Email copied' : 'Copy email address'}
              title={copied ? 'Copied!' : 'Copy'}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} />
            </button>
          </div>
          <p className="footer-muted"><Icon name="location" size={14} /> {profile.location}</p>
          <a href={profile.resumeUrl} className="footer-muted footer-link" download>
            <Icon name="download" size={14} /> Resume (PDF)
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with TanStack Start · Updated {meta.updated}
        </p>
        <button
          type="button"
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top <Icon name="arrowUp" size={14} />
        </button>
      </div>

      <p className="footer-wordmark" aria-hidden="true">{profile.name}</p>
    </footer>
  )
}
