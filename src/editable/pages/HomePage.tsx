import type { Metadata } from 'next'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchHomeTaskFeed, fetchHomeTimeSections, fetchTaskPosts, type HomeTimeSection } from '@/lib/task-data'
import { pagesContent } from '@/editable/content/pages.content'
import type { SitePost } from '@/lib/site-connector'
import { EditableHomeCta, EditableHomeHero, EditableMagazineSplit, EditableStoryRail, EditableTimeCollections } from '@/editable/sections/HomeSections'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: pagesContent.home.metadata.title,
    description: pagesContent.home.metadata.description,
    openGraphTitle: pagesContent.home.metadata.openGraphTitle,
    openGraphDescription: pagesContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...pagesContent.home.metadata.keywords],
  })
}

type TaskFeedItem = { task: (typeof SITE_CONFIG.tasks)[number]; posts: SitePost[] }

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function postKey(post: SitePost) {
  return post.slug || post.id || post.title || ''
}

function takeChunk(posts: SitePost[], start: number, size: number) {
  return posts.slice(start, start + size)
}

export default async function HomePage() {
  const primaryTask = (SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'pdf')?.key || SITE_CONFIG.tasks.find((task) => task.enabled)?.key || 'article') as TaskKey
  const primaryRoute = SITE_CONFIG.taskViews[primaryTask] || `/${primaryTask}`
  const taskFeed: TaskFeedItem[] = await fetchHomeTaskFeed(24, { timeoutMs: 2500 })
  const pdfPosts = await fetchTaskPosts('pdf', 48, { fresh: true }).catch(() => [])
  const primaryPosts = uniquePosts((pdfPosts.length ? pdfPosts : taskFeed.find(({ task }) => task.key === primaryTask)?.posts || taskFeed.flatMap(({ posts }) => posts))).slice(0, 48)
  const heroPosts = takeChunk(primaryPosts, 0, 7)
  const storyPosts = takeChunk(primaryPosts, 7, 12)
  const magazinePosts = takeChunk(primaryPosts, 19, 6)
  const timePosts = takeChunk(primaryPosts, 25, 12)
  const usedKeys = new Set([...heroPosts, ...storyPosts, ...magazinePosts].map(postKey).filter(Boolean))
  const rawTimeSections: HomeTimeSection[] = await fetchHomeTimeSections(primaryTask, { limit: 8, timeoutMs: 2500 })
  const timeSections = rawTimeSections
    .map((section) => ({
      ...section,
      posts: uniquePosts(section.posts).filter((post) => !usedKeys.has(postKey(post))),
    }))
    .filter((section) => section.posts.length)
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')

  return (
    <EditableSiteShell>
      <main>
      <SchemaJsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_CONFIG.name,
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <EditableHomeHero primaryTask={primaryTask} primaryRoute={primaryRoute} posts={heroPosts.length ? heroPosts : primaryPosts} timeSections={timeSections} />
      <EditableStoryRail primaryTask={primaryTask} primaryRoute={primaryRoute} posts={storyPosts.length ? storyPosts : primaryPosts.slice(7)} timeSections={timeSections} />
      <EditableMagazineSplit primaryTask={primaryTask} primaryRoute={primaryRoute} posts={magazinePosts.length ? magazinePosts : primaryPosts.slice(19)} timeSections={timeSections} />
      <EditableTimeCollections primaryTask={primaryTask} primaryRoute={primaryRoute} posts={timePosts.length ? timePosts : primaryPosts.slice(25)} timeSections={timeSections} />
      <EditableHomeCta />
      </main>
    </EditableSiteShell>
  )
}
