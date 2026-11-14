import { createServerFn } from '@tanstack/react-start'
import { getRequestIP } from '@tanstack/react-start/server'
import { z } from 'zod'
import { content } from '#/content'

export const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.email('Please enter a valid email'),
  message: z.string().trim().min(10, 'Message should be at least 10 characters').max(5000),
})

// What the browser sends: the fields above, plus two spam signals the form
// adds on its own. `website` is a hidden field people never see, so anything
// in it came from a bot. `openedAt` is when the form appeared on screen.
const Submission = ContactSchema.extend({
  website: z.string().optional(),
  openedAt: z.number().optional(),
})

export type ContactInput = z.infer<typeof ContactSchema>

/*
 * Settings (Vercel project settings and .env.local):
 *   RESEND_API_KEY     turns on email. Without it, messages are saved to
 *                      data/messages.json locally, or written to the logs on Vercel.
 *   CONTACT_TO         where messages go (default: the email in content.json)
 *   CONTACT_FROM       who they come from (default: Resend's shared test sender,
 *                      which can only send to the Resend account's own address).
 *                      Use an address on a domain verified in Resend, e.g.
 *                      "Valliyappan <hello@yourdomain.com>".
 *   CONTACT_AUTOREPLY  "1" also sends the visitor a short thank-you. Needs
 *                      CONTACT_FROM on a verified domain.
 */

/** Forms sent faster than this after appearing are almost certainly bots. */
const MIN_FILL_MS = 3000
/** Messages one visitor can send per hour. Kept per server instance, so it's a soft limit. */
const PER_HOUR = 5
const recent = new Map<string, Array<number>>()

function tooMany(key: string) {
  const now = Date.now()
  const times = (recent.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000)
  if (times.length >= PER_HOUR) return true
  recent.set(key, [...times, now])
  return false
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
/** Names and subjects can't be used to add email headers. */
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim()

function card(title: string, rows: Array<string>, footer: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1d1c1d">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e5e6;border-radius:14px">
    <tr><td style="padding:28px 28px 8px"><h1 style="margin:0 0 14px;font-size:20px;line-height:26px">${title}</h1>${rows.join('')}</td></tr>
    <tr><td style="padding:14px 28px 22px;border-top:1px solid #e5e5e6;font-size:12px;color:#8a898a">${footer}</td></tr>
  </table></body></html>`
}

async function sendEmail(key: string, mail: { from: string; to: string; replyTo?: string; subject: string; html: string; text: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: mail.from, to: [mail.to], reply_to: mail.replyTo, subject: mail.subject, html: mail.html, text: mail.text }),
  })
  if (!res.ok) throw new Error(`Resend refused the email (${res.status}): ${(await res.text()).slice(0, 200)}`)
}

async function saveLocally(entry: Record<string, unknown>) {
  if (process.env.VERCEL) {
    console.log('[contact] new message', JSON.stringify(entry))
    return
  }
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const file = path.resolve('data/messages.json')
  await fs.mkdir(path.dirname(file), { recursive: true })
  let messages: Array<unknown> = []
  try {
    messages = JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {}
  messages.push(entry)
  await fs.writeFile(file, JSON.stringify(messages, null, 2))
}

// Runs only on the server. Emails the message to me through Resend, with
// Reply-To set to the sender so answering is one click.
export const sendContactMessage = createServerFn({ method: 'POST' })
  .validator(Submission)
  .handler(async ({ data }) => {
    const { website, openedAt, ...message } = data
    // Bots get the same "sent" answer as people, so they learn nothing; their message is dropped.
    if (website || (openedAt && Date.now() - openedAt < MIN_FILL_MS)) return { ok: true as const }
    if (tooMany(getRequestIP({ xForwardedFor: true }) ?? 'unknown')) {
      throw new Error('Too many messages from here. Please try again later, or email me directly.')
    }

    const name = oneLine(message.name)
    const entry = { ...message, name, receivedAt: new Date().toISOString() }
    const key = process.env.RESEND_API_KEY
    if (!key) {
      await saveLocally(entry)
      return { ok: true as const }
    }

    const { profile } = content
    const to = process.env.CONTACT_TO || profile.email
    const from = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>'
    const body = esc(message.message).replace(/\n/g, '<br>')

    await sendEmail(key, {
      from, to, replyTo: message.email,
      subject: oneLine(`New message from ${name} via your portfolio`),
      text: `${name} <${message.email}> wrote:\n\n${message.message}\n\nReply to this email to answer them.`,
      html: card(`New message from ${esc(name)}`, [
        `<p style="margin:0 0 16px;font-size:14px;color:#616061"><a href="mailto:${esc(message.email)}" style="color:#2563eb">${esc(message.email)}</a></p>`,
        `<div style="padding:16px;border-radius:10px;background:#f6f6f4;font-size:15px;line-height:23px;white-space:normal">${body}</div>`,
      ], 'Sent from the contact form on your portfolio. Reply to this email to answer them.'),
    })

    if (process.env.CONTACT_AUTOREPLY === '1') {
      // A thank-you is nice but optional: if it fails, the message has still reached me.
      await sendEmail(key, {
        from, to: message.email, replyTo: to,
        subject: oneLine(`Thanks for your message, ${name.split(' ')[0]}`),
        text: `Hi ${name},\n\nThanks for getting in touch. I've got your message and usually reply within a day.\n\n${profile.name}\n\nYour message:\n${message.message}`,
        html: card(`Thanks, ${esc(name.split(' ')[0] ?? name)}`, [
          `<p style="margin:0 0 16px;font-size:15px;line-height:23px">I've got your message and usually reply within a day.</p>`,
          `<p style="margin:0 0 6px;font-size:13px;color:#8a898a">Your message</p><div style="padding:16px;border-radius:10px;background:#f6f6f4;font-size:14px;line-height:22px;color:#616061">${body}</div>`,
        ], `${esc(profile.name)} · ${esc(profile.role)}`),
      }).catch((e: Error) => console.error('[contact] thank-you email failed:', e.message))
    }

    return { ok: true as const }
  })
