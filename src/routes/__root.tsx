import type { ReactNode } from 'react'
import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { content } from '#/content'
import { Cursor } from '#/components/Cursor'
import appCss from '../styles.css?url'


export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: content.meta.title },
      { name: 'description', content: content.meta.description },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@400;500;600;700&family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="not-found">
      <p className="label">404</p>
      <h1 className="serif">Nothing here.</h1>
      <Link to="/" className="pill-link">Back home</Link>
    </div>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* marks that JS runs, so scroll fade-ins may start hidden (without
            JS, or before it loads, content simply shows) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Cursor />
        <Scripts />
      </body>
    </html>
  )
}
