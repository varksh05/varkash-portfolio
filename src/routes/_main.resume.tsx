import { createFileRoute } from '@tanstack/react-router'
import { content } from '#/content'
import { Icon } from '#/components/Icon'
import { Reveal } from '#/components/Reveal'
import { SectionHead } from '#/components/SectionHead'
import { Education, Experience } from '#/components/Experience'
import { WhatIBring } from '#/components/WhatIBring'

export const Route = createFileRoute('/_main/resume')({
  head: () => ({ meta: [{ title: `Resume · ${content.profile.name}` }] }),
  component: Resume,
})

function Resume() {
  const { profile } = content
  return (
    <main className="page">
      <div className="page-hero">
        <div className="hero-bg hero-bg-soft" aria-hidden="true" />
        <div className="container resume-hero">
          <Reveal>
            <p className="eyebrow">Resume</p>
            <h1 className="page-title">{profile.name}</h1>
            <p className="hero-sub">{profile.role} · {profile.location}</p>
          </Reveal>
          <Reveal delay={100} className="hero-ctas">
            <a href={profile.resumeUrl} className="btn btn-light btn-lg" download>
              <Icon name="download" size={18} /> Download PDF
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost btn-lg">
              <Icon name="mail" /> Email me
            </a>
          </Reveal>
        </div>
      </div>

      <div className="container sections">
        <section className="block">
          <SectionHead title="Work history" />
          <Experience />
        </section>

        <section className="block">
          <SectionHead title="Studies" />
          <Education />
        </section>

        <section className="block">
          <SectionHead title="What I bring" />
          <WhatIBring />
        </section>
      </div>
    </main>
  )
}
