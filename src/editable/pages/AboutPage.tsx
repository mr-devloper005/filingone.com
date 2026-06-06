import Link from 'next/link'
import { ArrowRight, BookOpen, FileText, Search, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const highlights = [
  {
    icon: FileText,
    title: 'Document-led browsing',
    description: 'PDFs and other useful reading pieces stay easy to scan, open, and revisit from one clean archive flow.',
  },
  {
    icon: Search,
    title: 'Search that stays practical',
    description: 'Visitors can move from the homepage into search and archive filters without losing context or rhythm.',
  },
  {
    icon: Sparkles,
    title: 'Editorial presentation',
    description: 'Cards, sections, and detail pages use mixed layouts so the site feels designed rather than templated.',
  },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--editable-page-bg,#f7f2ea)] px-4 py-14 text-[var(--editable-page-text,#121a2a)] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-8 shadow-[0_24px_70px_rgba(26,50,99,0.08)] lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{pagesContent.about.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>

            <div className="mt-8 grid gap-4 rounded-[2rem] border border-[#1a32631f] bg-[var(--slot4-gray)] p-5 sm:grid-cols-3">
              {[
                ['PDF-first', 'Featured documents lead the front page.'],
                ['Premium feel', 'Classic spacing with a quieter visual rhythm.'],
                ['Safe fallbacks', 'Pages stay composed even with missing fields.'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.4rem] bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 text-sm leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                Open PDF library <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[#1a32631f] bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">
                Search content
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[2.4rem] border border-[#1a32631f] bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_24px_70px_rgba(11,15,22,0.18)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/60">What this site does</p>
              <h2 className="mt-4 text-3xl font-black leading-[0.98] tracking-[-0.06em]">A polished home for documents and useful reading.</h2>
              <p className="mt-4 text-sm leading-7 text-white/72">
                The experience is designed to feel calm, readable, and premium from the top nav down to the archive pages.
              </p>
            </div>

            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[2rem] border border-[#1a32631f] bg-white p-6 shadow-[0_18px_50px_rgba(26,50,99,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-cream)] text-[var(--slot4-accent)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black tracking-[-0.04em]">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{item.description}</p>
                </div>
              )
            })}

            <div className="rounded-[2rem] border border-[#1a32631f] bg-[var(--slot4-gray)] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Site direction</p>
              <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
                Filingone is built to make reading feel effortless and to make PDF browsing feel intentional.
              </p>
              <p className="mt-4 text-sm font-black text-[var(--slot4-page-text)]">{SITE_CONFIG.name}</p>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
