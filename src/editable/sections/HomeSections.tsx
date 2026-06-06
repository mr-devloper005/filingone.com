 'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref, getEditableExcerpt, getEditableCategory } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function safeExcerpt(post?: SitePost | null, limit = 130) {
  return getEditableExcerpt(post, limit) || 'A useful post with a clean summary will appear here once content is available.'
}

function CoverFrame({ post, href, priority = false }: { post: SitePost; href: string; priority?: boolean }) {
  return (
    <Link href={href} className={`group relative block self-start overflow-hidden rounded-[1.8rem] border ${pal.border} bg-white shadow-[0_16px_50px_rgba(26,50,99,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(26,50,99,0.16)]`}>
      <div className={`relative ${priority ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
        <img src={getEditablePostImage(post)} alt={post.title || 'Featured post'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,18,0.08)_15%,rgba(8,12,18,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/70">{getEditableCategory(post)}</p>
          <h3 className={`mt-2 line-clamp-3 ${priority ? 'text-2xl' : 'text-lg'} font-black leading-[0.98] tracking-[-0.05em]`}>{post.title || 'Untitled post'}</h3>
        </div>
      </div>
    </Link>
  )
}

function CompactRailCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group flex min-w-0 gap-3 rounded-[1.25rem] border ${pal.border} bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(26,50,99,0.12)]`}>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post preview'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">No. {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 line-clamp-2 text-sm font-black leading-snug tracking-[-0.03em]">{post.title || 'Untitled post'}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{safeExcerpt(post, 84)}</p>
      </div>
    </Link>
  )
}

function HorizontalFeature({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group grid overflow-hidden rounded-[2rem] border ${pal.border} bg-white shadow-[0_18px_55px_rgba(26,50,99,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(26,50,99,0.16)] md:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className="relative min-h-[210px] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title || 'Feature preview'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Featured story</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-[1] tracking-[-0.06em] sm:text-[2rem]">{post.title || 'Untitled post'}</h3>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{safeExcerpt(post, 170)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          Read piece <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function ListRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group flex gap-4 rounded-[1.45rem] border ${pal.border} bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(26,50,99,0.12)]`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-black text-[var(--slot4-page-text)]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em]">{post.title || 'Untitled post'}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{safeExcerpt(post, 112)}</p>
      </div>
    </Link>
  )
}

function Rail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[0]
  const railPosts = posts.slice(1, 7)
  const headline = pagesContent.home.hero.title.join(' ') || `A thoughtful home for ${taskLabel(primaryTask).toLowerCase()}.`

  return (
    <section className="relative overflow-hidden border-b border-[#1a326315] bg-[linear-gradient(180deg,#f8f4ec_0%,#fefcf7_60%,#edf4f8_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[6%] h-72 w-72 rounded-full bg-[rgba(84,119,146,0.16)] blur-3xl" />
        <div className="absolute right-[-6%] top-[18%] h-96 w-96 rounded-full bg-[rgba(255,197,112,0.22)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5rem]">{headline}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)] sm:text-lg">{pagesContent.home.hero.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={primaryRoute} className={dc.button.primary}>
              {pagesContent.home.hero.primaryCta.label}
            </Link>
            <Link href="/search" className={dc.button.secondary}>
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <div className={`rounded-[2.4rem] border ${pal.border} bg-[rgba(11,15,22,0.95)] p-4 text-white shadow-[0_30px_80px_rgba(11,15,22,0.2)] sm:p-5`}>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-2 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">{pagesContent.home.hero.featureCardBadge}</p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.04em] sm:text-2xl">{pagesContent.home.hero.featureCardTitle}</h2>
              </div>
              <div className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/55 sm:flex">
                
                
                
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="relative overflow-hidden rounded-[1.8rem] bg-[#10151d] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
                {feature ? (
                  <>
                    <img src={getEditablePostImage(feature)} alt={feature.title || 'Featured post'} className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,22,0.1),rgba(10,14,22,0.8))]" />
                    <div className="relative z-10 flex aspect-[4/5] min-h-[320px] flex-col justify-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/65">{getEditableCategory(feature)}</p>
                      <h3 className="mt-4 max-w-md text-4xl font-black leading-[0.92] tracking-[-0.08em] sm:text-5xl">{feature.title || 'Featured post'}</h3>
                      <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">{safeExcerpt(feature, 175)}</p>
                      <Link href={postHref(primaryTask, feature, primaryRoute)} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
                        Open feature <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex aspect-[4/5] min-h-[320px] items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/65">No featured post yet</p>
                      <h3 className="mt-4 text-4xl font-black tracking-[-0.08em]">The front page is ready for new issues.</h3>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {railPosts.slice(0, 6).map((post, index) => (
                  <CoverFrame key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} priority={index === 0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 12)
  const [visibleCount, setVisibleCount] = useState(4)
  const visiblePosts = railPosts.slice(0, visibleCount)
  if (!railPosts.length) return null
  return (
    <section className="border-b border-[#1a326315] bg-[#3d4547] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[980px] rounded-[2.4rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_28px_70px_rgba(11,15,22,0.16)] sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/55">Shared reading</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">A visual wall of recent documents</h2>
            </div>
          </div>
          <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePosts.map((post, index) => (
              <CoverFrame
                key={post.id || post.slug || index}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                priority={index === 0}
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            {visibleCount < railPosts.length ? (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + 4, railPosts.length))}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-[var(--slot4-page-text)]"
              >
                Load more
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 6)
  if (!featured.length) return null
  const feature = featured[0]
  const stack = featured.slice(1, 4)
  const list = featured.slice(4, 6)

  return (
    <section className="border-b border-[#1a326315] bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
        <div className="space-y-6">
          <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Personalization</p>
          <h2 className="max-w-xl text-3xl font-black leading-[0.98] tracking-[-0.06em] sm:text-4xl">A reading room that still feels easy to browse.</h2>
          <p className="max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">
            Blend document previews, article snippets, and concise resource cards in a layout that stays premium on large screens and compact on mobile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={primaryRoute} className={dc.button.secondary}>
              Explore {taskLabel(primaryTask).toLowerCase()}
            </Link>
            <Link href="/contact" className={dc.button.primary}>
              Talk to us
            </Link>
          </div>
          <div className="rounded-[2rem] border border-[#1a326315] bg-[var(--slot4-gray)] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Search-first flow</p>
            <form action="/search" className="mt-4 flex items-center gap-3 rounded-full border border-[#1a326320] bg-white p-2">
              <Search className="ml-2 h-4 w-4 text-[var(--slot4-muted-text)]" />
              <input name="q" placeholder="Search posts, documents, or topics" className="min-w-0 flex-1 bg-transparent px-2 text-sm font-bold outline-none placeholder:text-current/30" />
              <button className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-sm font-black text-white">
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="grid gap-5">
          <HorizontalFeature post={feature} href={postHref(primaryTask, feature, primaryRoute)} />
          <div className="grid gap-4 md:grid-cols-2">
            {stack.map((post, index) => (
              <CoverFrame key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
          <div className="grid gap-4">
            {list.map((post, index) => (
              <ListRow key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts.slice(6)
  const feature = sectionPosts[0] || posts[0]
  const secondary = sectionPosts.slice(1, 5)
  const list = sectionPosts.slice(5, 10)

  return (
    <section className="border-b border-[#1a326315] bg-[linear-gradient(180deg,#ffffff_0%,#fbf7f0_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 text-center">
          <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>Statistics</p>
          <h2 className="text-3xl font-black tracking-[-0.06em] sm:text-4xl">Build a browsing rhythm around useful documents.</h2>
          <p className="mx-auto max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">
            Switch between featured reading, compact lists, and calmer archive cards without changing route behavior or breaking missing-field fallbacks.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          {feature ? (
            <Link href={postHref(primaryTask, feature, primaryRoute)} className="group overflow-hidden rounded-[2.2rem] border border-[#1a326315] bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_70px_rgba(11,15,22,0.2)] transition hover:-translate-y-1">
              <div className="relative aspect-[7/5] min-h-[220px] overflow-hidden">
                <img src={getEditablePostImage(feature)} alt={feature.title || 'Featured document'} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,18,0.12),rgba(8,12,18,0.78))]" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/65">Featured stream</p>
                  <h3 className="mt-4 max-w-2xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl">{feature.title || 'Featured post'}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/76">{safeExcerpt(feature, 180)}</p>
                </div>
              </div>
            </Link>
          ) : null}

          <div className="grid gap-4">
            {secondary.map((post, index) => (
              <HorizontalFeature key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {list.map((post, index) => (
            <ListRow key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[linear-gradient(180deg,#fbf7f0_0%,#f4ede2_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-[#1a326315] bg-white p-8 text-center shadow-[0_20px_60px_rgba(26,50,99,0.1)] sm:p-10 lg:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-cream)] text-[var(--slot4-accent)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent)]">Explore even more</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] sm:text-4xl">Browse the archive at your own pace.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">
            The same clean rhythm continues through search, archives, detail pages, and support screens, so the site feels consistent from top to bottom.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/search" className={dc.button.secondary}>
              Search everything
            </Link>
            <Link href="/pdf" className={dc.button.primary}>
              Open PDF library
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
