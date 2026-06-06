import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

const placeholderImage = '/placeholder.svg?height=900&width=1400'

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isUrl(value: string) {
  return value.startsWith('/') || /^https?:\/\//i.test(value)
}

export function getEditablePostImage(post?: SitePost | null) {
  const content = getContent(post)
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && isUrl(item.url))?.url
  const images = Array.isArray(content.images) ? content.images.filter((item): item is string => typeof item === 'string' && isUrl(item)) : []
  const image = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).find((value) => value && isUrl(value))
  return mediaUrl || images[0] || image || placeholderImage
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = getContent(post)
  const raw =
    asText(content.description) ||
    asText(content.summary) ||
    post?.summary ||
    asText(content.excerpt) ||
    asText(content.body) ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = getContent(post)
  return asText(content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-6 sm:p-8 lg:min-h-[620px]">
        <img src={getEditablePostImage(post)} alt={post.title || label} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,34,0.06),rgba(18,24,34,0.86))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl lg:text-6xl">{post.title || 'Untitled post'}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">{getEditableExcerpt(post, 190) || 'A featured post will appear here with a clear summary once content is available.'}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">
            Read story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[1.6rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img src={getEditablePostImage(post)} alt={post.title || 'Post preview'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title || 'Untitled post'}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 135) || 'A short preview will appear here.'}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.5rem] border ${pal.border} bg-[var(--slot4-gray)] p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-xs font-black text-[var(--slot4-page-text)]">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] ${pal.accentText}`}>
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title || 'Untitled post'}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 105) || 'A concise note will appear here.'}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const summary = getEditableExcerpt(post, 180)
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border ${pal.border} bg-white p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className="relative overflow-hidden rounded-[1.45rem] bg-[var(--slot4-media-bg)] aspect-[4/3] sm:aspect-auto sm:min-h-[200px]">
        <img src={image} alt={post.title || 'Article preview'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,22,0.04),rgba(10,14,22,0.46))]" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          Read {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-3xl">{post.title || 'Untitled post'}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary || 'A short summary will appear here.'}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-page-text)]">
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
