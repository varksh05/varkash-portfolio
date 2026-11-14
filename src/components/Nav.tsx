import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { content } from '#/content'
import { Icon } from './Icon'

export function Nav() {
  const { profile } = content
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const close = () => setOpen(false)
  // On phones the links hide in the menu, so the bar names the page you're on.
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const title = pathname === '/' ? 'Home' : pathname.startsWith('/work') ? 'Work' : pathname.startsWith('/blog') ? 'Blog' : pathname.startsWith('/resume') ? 'Resume' : ''

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''} ${open ? 'nav-open' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close} aria-label={`${profile.name}, home`}>
          <span className={`brand-mark ${profile.avatar ? 'has-photo' : ''}`}>
            {profile.avatar ? <img src={profile.avatar} alt="" /> : profile.initials}
          </span>
          <span className="brand-name">{profile.name}</span>
        </Link>
        {title && <span className="nav-title" aria-hidden="true">{title}</span>}

        {/* Icon links, centred in the island; labels show as tooltips
            (and as text in the mobile menu). */}
        <nav className="nav-links" aria-label="Main">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: 'active' }} onClick={close} data-tip="Home" className="hover-solid">
            <Icon name="home" size={18} variant="swap" /><span className="nav-label">Home</span>
          </Link>
          <Link to="/work" activeProps={{ className: 'active' }} onClick={close} data-tip="Work" className="hover-solid">
            <Icon name="repo" size={18} variant="swap" /><span className="nav-label">Work</span>
          </Link>
          <Link to="/blog" activeProps={{ className: 'active' }} onClick={close} data-tip="Blog" className="hover-solid">
            <Icon name="quill" size={18} variant="swap" /><span className="nav-label">Blog</span>
          </Link>
          <Link to="/resume" activeProps={{ className: 'active' }} onClick={close} data-tip="Resume" className="hover-solid">
            <Icon name="file" size={18} variant="swap" /><span className="nav-label">Resume</span>
          </Link>
        </nav>

        <div className="nav-actions">
          <Link to="/" hash="contact" className="btn btn-light btn-sm nav-cta" onClick={close}>
            <Icon name="mail" /> Say hello
          </Link>
          <button
            className="nav-icon nav-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
