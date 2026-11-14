import type { IconType } from 'react-icons'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { MdEmail, MdOpenInNew } from 'react-icons/md'

// Brand marks for social links (and email), from react-icons. They take the
// text colour, so hover styles that change `color` still apply.
function pick(label: string): IconType {
  const l = label.toLowerCase()
  if (l.includes('github')) return FaGithub
  if (l.includes('linkedin')) return FaLinkedin
  if (l === 'x' || l.includes('twitter')) return FaXTwitter
  if (l.includes('mail')) return MdEmail
  return MdOpenInNew
}

export function SocialIcon({ label, size = 18, className }: { label: string; size?: number; className?: string }) {
  const Glyph = pick(label)
  return <Glyph size={size} className={`icon social-icon ${className ?? ''}`.trim()} aria-hidden="true" focusable="false" />
}
