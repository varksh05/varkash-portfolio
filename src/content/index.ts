import { z } from 'zod'
import raw from './content.json'

// ─────────────────────────────────────────────────────────────
// Everything on the site comes from content.json. This schema checks
// the file at startup, so a typo shows a clear error instead of a
// broken page. Text fields support **bold**, *italic* and [links](url).
// ─────────────────────────────────────────────────────────────

const LinkSchema = z.object({ label: z.string(), url: z.string() })
const StatSchema = z.object({ label: z.string(), value: z.string() })

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'use lowercase letters, numbers and dashes'),
  featured: z.boolean(),
  title: z.string(),
  summary: z.string(),
  language: z.string(),
  year: z.number().int(),
  tags: z.array(z.string()),
  cover: z.object({
    image: z.string(),
    colors: z.tuple([z.string(), z.string()]),
  }),
  metrics: z.array(StatSchema),
  meta: z.array(StatSchema),
  links: z.array(LinkSchema),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })),
})

export type Project = z.infer<typeof ProjectSchema>

// Blog posts. `body` is a list of blocks: paragraphs by default, plus
// "## Heading", "> Quote", "- List item", and ```lang code``` blocks.
export const PostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'use lowercase letters, numbers and dashes'),
  title: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD'),
  excerpt: z.string(),
  tags: z.array(z.string()),
  cover: z.object({ colors: z.tuple([z.string(), z.string()]) }),
  body: z.array(z.string()),
})

export type Post = z.infer<typeof PostSchema>

const ContentSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string(), updated: z.string() }),
  profile: z.object({
    name: z.string(),
    pronunciation: z.string(),
    initials: z.string(),
    role: z.string(),
    location: z.string(),
    avatar: z.string(),
    email: z.string(),
    resumeUrl: z.string(),
    status: z.string(),
    socials: z.array(LinkSchema),
  }),
  hero: z.object({
    title: z.string(),
    // Typed out one after another in the hero (first one shows on load).
    highlights: z.array(z.string()).min(1),
    subtitle: z.string(),
  }),
  stats: z.array(StatSchema),
  // `openTo` and `stack` fill the recruiter snapshot on the back of the hero card.
  idCard: z.object({
    label: z.string(),
    idNumber: z.string(),
    issued: z.string(),
    openTo: z.string(),
    stack: z.array(z.string()),
  }),
  projects: z.array(ProjectSchema),
  posts: z.array(PostSchema),
  about: z.object({
    photo: z.string(),
    headline: z.string(),
    paragraphs: z.array(z.string()),
    now: z.array(StatSchema),
  }),
  resume: z.object({
    // LinkedIn-style: one entry per company, roles newest first.
    // Dates are "YYYY-MM"; leave `end` empty for a current role.
    experience: z.array(
      z.object({
        company: z.string(),
        logo: z.string(),
        color: z.string(),
        url: z.string(),
        employmentType: z.string(),
        location: z.string(),
        workplace: z.string(),
        roles: z
          .array(
            z.object({
              title: z.string(),
              start: z.string().regex(/^\d{4}-\d{2}$/, 'use YYYY-MM'),
              end: z.string().regex(/^(\d{4}-\d{2})?$/, 'use YYYY-MM, or "" for present'),
              promotion: z.boolean(),
              // optional one-line headline for this chapter of the story timeline
              headline: z.string().default(''),
              summary: z.string(),
              skills: z.array(z.string()),
            }),
          )
          .min(1),
      }),
    ),
    // LinkedIn-style, newest first. Dates "YYYY-MM"; `end` "" = ongoing.
    education: z.array(
      z.object({
        school: z.string(),
        logo: z.string(),
        color: z.string(),
        url: z.string(),
        degree: z.string(),
        field: z.string(),
        start: z.string().regex(/^\d{4}-\d{2}$/, 'use YYYY-MM'),
        end: z.string().regex(/^(\d{4}-\d{2})?$/, 'use YYYY-MM, or "" for ongoing'),
        grade: z.string(),
        location: z.string(),
        headline: z.string().default(''),
        summary: z.string(),
        skills: z.array(z.string()),
      }),
    ),
    // "What I bring": strengths with a one-line detail, tools grouped by area.
    skills: z.array(z.object({ name: z.string(), detail: z.string() })),
    tools: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  }),
  contact: z.object({ heading: z.string(), blurb: z.string() }),
  footer: z.object({ tagline: z.string(), ctaTitle: z.string(), ctaText: z.string() }),
})

export type Content = z.infer<typeof ContentSchema>

const parsed = ContentSchema.safeParse(raw)
if (!parsed.success) {
  throw new Error(`content.json is invalid:\n${z.prettifyError(parsed.error)}`)
}

export const content: Content = parsed.data
