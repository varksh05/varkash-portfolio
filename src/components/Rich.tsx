import { Fragment } from 'react'

// Renders the small markup allowed in content.json:
// **bold**, *italic*, `code` and [label](url).
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g

export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const external = /^https?:/.test(link[2])
          return (
            <a
              key={i}
              href={link[2]}
              className="inline-link"
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link[1]}
            </a>
          )
        }
        if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
