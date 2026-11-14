# Valliyappan's Portfolio

Personal portfolio built with **TanStack Start**, using only TanStack's own pieces:

| Concern  | Library | Where |
|----------|---------|-------|
| Routing / SSR | TanStack Router + Start | `src/routes/` (file-based) |
| Data | TanStack DB | `src/db/collections.ts` — projects collection + live queries |
| Forms | TanStack Form | `src/components/ContactForm.tsx` |
| Server logic | Start server functions | `src/server/contact.ts` |

Zod defines the schemas shared by the DB collection and the form.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Routes

An editorial portfolio: ivory canvas, Google Sans titles, Inter for body
text and a single blue accent.
Light theme only. Fully responsive: wide, tablet and phone layouts.

- `/` — hero + flippable ID card, stats, selected work, latest blog posts,
  about, experience, toolbox strip, contact form
- `/work` — all projects; filter with `?tag=`, `?q=`
- `/blog` — all posts; filter with `?tag=`, `?q=`
- `/blog/:slug` — article page
- `/work/:slug` — case study page
- `/resume` — experience, education, skills, tools

## Edit content

**Everything on the site comes from [`src/content/content.json`](src/content/content.json).**
The file is checked against a schema (`src/content/index.ts`) on startup, so a
typo or missing field shows a clear error naming the exact field.

- Text supports `**bold**`, `*italic*`, `` `code` `` and `[link text](https://…)`.
- `profile.avatar` (hero card), `about.photo` and `projects[].cover.image` take an image
  path — drop files in `public/` and use e.g. `"/me.jpg"`. Leave them `""` to
  show the gradient placeholder.
- `projects[].slug` becomes the URL: `/work/<slug>`.
- `hero` holds the big headline; `highlights` is a list of gradient phrases
  that are typed out one after another (the first shows on load), `stats` the
  numbers under it, `idCard` the badge label / ID number / issue date, and
  `footer` the footer tagline and call-to-action text. `projects[].language` sets the coloured language dot.

### Blog posts

Add an object to `posts` (newest dates appear first). `body` is a list of blocks:

```json
{
  "slug": "my-post", "title": "My post", "date": "2026-11-13",
  "excerpt": "One-line summary for cards.", "tags": ["TypeScript"],
  "cover": { "colors": ["#6366f1", "#22d3ee"] },
  "body": [
    "A normal paragraph with **bold** and `code`.",
    "## A heading",
    "- a list item",
    "- another item",
    "> A pull quote",
    "```ts\nconst x = 1\n```"
  ]
}
```

Reading time is calculated automatically. Posts live in a TanStack DB collection.

### Experience (LinkedIn-style)

`resume.experience` has one entry per **company**, with its roles listed
**newest first**:

```json
{
  "company": "Company One", "logo": "/logos/company-one.png", "color": "#6366f1",
  "url": "https://…", "employmentType": "Full-time",
  "location": "Chennai, India", "workplace": "Hybrid",
  "roles": [
    { "title": "Software Engineer II", "start": "2025-04", "end": "", "promotion": true,
      "summary": "…", "skills": ["React", "TypeScript"] },
    { "title": "Software Engineer", "start": "2024-01", "end": "2025-03", "promotion": false,
      "summary": "…", "skills": ["Node.js"] }
  ]
}
```

- Dates are `YYYY-MM`; `"end": ""` means *Present*. Durations ("1 yr 8 mos")
  and the company's total tenure are calculated automatically.
- `logo` is an image path (put files in `public/`); leave it `""` to show the
  company initials on a tile in `color`.
- `"promotion": true` adds a **Promoted** badge to that role.
- Skills get matching icons automatically.

### Education & "What I bring"

- `resume.education` uses the same LinkedIn style — one entry per school:
  `school`, `logo` (or `""` for an initials tile in `color`), `url`, `degree`,
  `field`, `start` / `end` (`YYYY-MM`, `end: ""` = ongoing), `grade`,
  `location`, `summary`, `skills`.
- `resume.skills` are your strengths: `{ "name": "API design", "detail": "one line" }`
  — each tile gets an icon from its name.
- `resume.tools` are grouped: `{ "group": "Frontend", "items": ["React", "CSS"] }`.
  These also feed the scrolling toolbox strip on the home page.

## Contact form

Messages are validated on the client (TanStack Form) and again on the server,
then appended to `data/messages.json` (gitignored). Before deploying, replace
the handler in `src/server/contact.ts` with an email service or database.

## Icons

Icons come from [Hugeicons](https://hugeicons.com): line icons from the free set
(`@hugeicons/core-free-icons`) and solid icons from **Hugeicons Pro**
(`@hugeicons-pro/core-solid-rounded`, needs the Pro registry token in `~/.npmrc`).
`<Icon name="…" variant="solid" />` renders the solid icon; `variant="swap"`
turns line → solid when a parent with class `hover-solid` is hovered or active. They're mapped to short
names in `src/components/Icon.tsx` — import another icon there and add it to
`ICONS` to use it anywhere with `<Icon name="…" />`. Social links in
content.json get GitHub / LinkedIn / X icons automatically from their label,
and toolbox / skill names get matching icons via `toolIcon()` (e.g. React,
Python, Docker); unknown names fall back to a code icon.

## Build

```bash
npm run build
npm run preview
npm run typecheck
```
