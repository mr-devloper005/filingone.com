import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => getEditableExcerpt(post, 140)

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const featured = index % 5 === 0
  const compact = index % 3 === 1

  if (compact) {
    return (
      <Link href={href} className="group flex gap-4 rounded-[1.6rem] border border-[#1a32631f] bg-white p-4 shadow-[0_18px_50px_rgba(26,50,99,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(26,50,99,0.12)]">
        {image ? <img src={image} alt={post.title || 'Search result preview'} className="h-24 w-24 shrink-0 rounded-[1.15rem] object-cover" /> : <div className="h-24 w-24 shrink-0 rounded-[1.15rem] bg-[var(--slot4-gray)]" />}
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{taskLabel}</p>
          <h2 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
          {summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[2rem] border border-[#1a32631f] bg-white shadow-[0_18px_50px_rgba(26,50,99,0.08)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(26,50,99,0.12)] ${featured ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-black ${featured ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt={post.title || 'Search result preview'} className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <h2 className="mt-4 line-clamp-3 text-2xl font-black leading-[0.95] tracking-[-0.06em] text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)] opacity-75 group-hover:opacity-100">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg,#f7f2ea)] text-[var(--editable-page-text,#121a2a)]">
        <section className="border-b border-[#1a32631f] bg-[linear-gradient(180deg,#fbf7f0_0%,#ffffff_100%)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
            <div className="rounded-[2.6rem] border border-[#1a32631f] bg-white p-7 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="rounded-[2.2rem] border border-[#1a32631f] bg-white p-5 shadow-[0_20px_55px_rgba(26,50,99,0.08)]">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[#1a326320] bg-[var(--slot4-gray)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/30" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-full border border-[#1a326320] bg-[var(--slot4-gray)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/30" />
                </label>
                <select name="task" defaultValue={task} className="rounded-full border border-[#1a326320] bg-[var(--slot4-gray)] px-4 py-3 text-sm font-black outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5" type="submit">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/pdf" className={dc.button.secondary}>
              Browse PDF library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-[#1a326325] bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(26,50,99,0.06)]">
              <p className="text-2xl font-black tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
