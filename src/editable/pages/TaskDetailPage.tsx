import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableShareButton } from '@/editable/components/EditableShareButton'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const getPdfBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.details) || ''
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => getEditableExcerpt(post, 180)
const categoryOf = (post: SitePost, fallback: string) => getEditableCategory(post) || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[#1a32631f] bg-white/85 px-4 py-2 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function PageShell({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">{children}</section>
}

function TopPanel({
  task,
  title,
  subtitle,
  description,
  image,
  extras,
}: {
  task: TaskKey
  title: string
  subtitle: string
  description: string
  image?: string
  extras?: ReactNode
}) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="grid gap-6 rounded-[2.8rem] border border-[#1a32631f] bg-white p-6 shadow-[0_24px_70px_rgba(26,50,99,0.09)] lg:grid-cols-[1.08fr_0.92fr] lg:p-10">
      <div className="min-w-0">
        <BackLink task={task} />
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{subtitle}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{description}</p>
        <div className="mt-7 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
          <span className="rounded-full border border-[#1a32631f] bg-[var(--slot4-gray)] px-3 py-1">{taskConfig?.label || task}</span>
          <span className="rounded-full border border-[#1a32631f] bg-[var(--slot4-gray)] px-3 py-1">{SITE_CONFIG.name}</span>
        </div>
      </div>
      <div className="rounded-[2.2rem] bg-[var(--slot4-dark-bg)] p-5 text-white shadow-[0_24px_70px_rgba(11,15,22,0.2)]">
        {image ? (
          <img src={image} alt={title || 'Detail preview'} className="aspect-[4/5] w-full rounded-[1.6rem] object-cover" />
        ) : (
          <div className="flex min-h-[320px] items-end rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.1))] p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">{taskConfig?.label || task}</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">{title}</h2>
            </div>
          </div>
        )}
        {extras ? <div className="mt-5">{extras}</div> : null}
      </div>
    </div>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0 rounded-[2.8rem] border border-[#1a32631f] bg-[var(--detail-surface)] p-5 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-8 lg:p-12">
          <TopPanel
            task="article"
            title={post.title || 'Article details'}
            subtitle={categoryOf(post, 'Article')}
            description={summaryText(post) || 'An article detail page will show the full reading view here.'}
            image={images[0] || getEditablePostImage(post)}
            extras={
              <div className="grid gap-3 sm:grid-cols-3">
                {[['Published', post.publishedAt], ['Category', getEditableCategory(post)], ['Read type', 'Article']].map(([label, value]) => (
                  <div key={String(label)} className="rounded-[1.2rem] border border-white/10 bg-white/10 p-4 text-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/55">{label}</p>
                    <p className="mt-2 font-black text-white">{String(value || '—')}</p>
                  </div>
                ))}
              </div>
            }
          />
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" related={related} />
      </div>
    </PageShell>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <PageShell>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-6 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[var(--slot4-gray)] ring-1 ring-[#1a32631f]">
              {logo ? <img src={logo} alt={post.title || 'Business preview'} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Business listing</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{post.title || 'Listing details'}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" related={related} />
        </aside>
      </div>
    </PageShell>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <PageShell>
      <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-[2.8rem] border border-[#1a32631f] bg-[var(--slot4-dark-bg)] p-7 text-white shadow-[0_24px_70px_rgba(11,15,22,0.2)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <p className="mt-10 text-[11px] font-black uppercase tracking-[0.28em] text-white/60">Classified notice</p>
          <h1 className="mt-4 text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl">{post.title || 'Classified details'}</h1>
          <div className="mt-8 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--slot4-cream)] px-5 py-3 text-sm font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-black transition hover:bg-white/10">Email</a> : null}
          </div>
        </aside>
        <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-6 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-9">
          <TopPanel
            task="classified"
            title={post.title || 'Classified details'}
            subtitle={categoryOf(post, 'Classified')}
            description={summaryText(post)}
            image={images[0] || getEditablePostImage(post)}
            extras={
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-[#1a32631f] bg-[var(--slot4-gray)] p-4 text-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Quick note</p>
                  <p className="mt-2 font-bold text-[var(--slot4-page-text)]">Fast-scan details and direct actions.</p>
                </div>
                <div className="rounded-[1.2rem] border border-[#1a32631f] bg-[var(--slot4-gray)] p-4 text-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Media</p>
                  <p className="mt-2 font-bold text-[var(--slot4-page-text)]">{images.length ? `${images.length} images found` : 'No media attached'}</p>
                </div>
              </div>
            }
          />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" related={related} />
        </article>
      </div>
    </PageShell>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-7 shadow-[0_24px_70px_rgba(26,50,99,0.08)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="image" />
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            <Camera className="h-4 w-4" /> Image story
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl">{post.title || 'Image details'}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[#1a32631f] bg-white shadow-[0_18px_50px_rgba(26,50,99,0.08)]">
              <img src={image} alt={post.title || 'Image preview'} className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--slot4-muted-text)]">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" related={related} /></div>
    </PageShell>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-7 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-10">
          <BackLink task="sbm" />
          <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[var(--slot4-dark-bg)] text-white"><Bookmark className="h-9 w-9" /></div>
          <h1 className="mt-7 text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{post.title || 'Saved resource'}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" related={related} />
      </div>
    </PageShell>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-6 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-9">
          <BackLink task="pdf" />
          <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[var(--slot4-dark-bg)] text-white"><FileText className="h-12 w-12" /></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">PDF resource</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{post.title || 'PDF details'}</h1>
            </div>
          </div>
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#1a32631f] bg-[var(--slot4-gray)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#1a32631f] bg-white p-4">
                <span className="text-sm font-black">Document preview</span>
                <div className="flex flex-wrap items-center gap-2">
                  <EditableShareButton />
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5">Download <Download className="h-4 w-4" /></Link>
                </div>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title || 'PDF preview'} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" related={related} />
      </div>
    </PageShell>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-8 text-center shadow-[0_24px_70px_rgba(26,50,99,0.08)] lg:sticky lg:top-24 lg:self-start">
          <BackLink task="profile" />
          <div className="mx-auto mt-10 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-gray)] ring-1 ring-[#1a32631f]">
            {images[0] ? <img src={images[0]} alt={post.title || 'Profile preview'} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.94] tracking-[-0.08em]">{post.title || 'Profile details'}</h1>
          {role ? <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2.8rem] border border-[#1a32631f] bg-white p-7 shadow-[0_24px_70px_rgba(26,50,99,0.08)] sm:p-10">
          <TopPanel
            task="profile"
            title={post.title || 'Profile details'}
            subtitle={categoryOf(post, 'Profile')}
            description={summaryText(post)}
            image={images[0] || getEditablePostImage(post)}
            extras={<div className="rounded-[1.2rem] border border-white/10 bg-white/10 p-4 text-sm text-white">Identity details, links, and a cleaner introduction appear above this reading block.</div>}
          />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" related={related} />
        </article>
      </div>
    </PageShell>
  )
}

function BodyContent({ post, compact = false, content }: { post: SitePost; compact?: boolean; content?: string }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[var(--slot4-page-text)]/88`} dangerouslySetInnerHTML={{ __html: formatPlainText(content ?? getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[#1a32631f] bg-[var(--slot4-gray)] p-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#1a32631f]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#1a32631f] bg-white shadow-[0_18px_50px_rgba(26,50,99,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[#1a32631f] bg-white p-5 shadow-[0_18px_50px_rgba(26,50,99,0.08)]">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[#1a32631f] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[#1a32631f] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/60">{label}</span><span className="font-black text-white">{value}</span></div>
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {related.length ? (
        <div className="rounded-[2rem] border border-[#1a32631f] bg-white/85 p-5 shadow-[0_18px_50px_rgba(26,50,99,0.06)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[#1a32631f] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(26,50,99,0.08)]">
      {image && task !== 'sbm' ? <img src={image} alt={post.title || 'Related preview'} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-gray)]"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[#1a32631f] bg-white/85 p-5 shadow-[0_18px_50px_rgba(26,50,99,0.06)]">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[#1a32631f] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
