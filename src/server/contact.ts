import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.email('Please enter a valid email'),
  message: z.string().trim().min(10, 'Message should be at least 10 characters'),
})

export type ContactInput = z.infer<typeof ContactSchema>

// Runs only on the server. Locally, messages are appended to
// data/messages.json. Hosted platforms like Vercel have a read-only file
// system, so there the message is logged (see the deployment's logs)
// instead. Swap this for an email service such as Resend to get them by mail.
export const sendContactMessage = createServerFn({ method: 'POST' })
  .validator(ContactSchema)
  .handler(async ({ data }) => {
    const entry = { ...data, receivedAt: new Date().toISOString() }
    if (process.env.VERCEL) {
      console.log('[contact] new message', JSON.stringify(entry))
      return { ok: true as const }
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
    return { ok: true as const }
  })
