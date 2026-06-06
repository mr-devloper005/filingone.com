import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A refined document library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Features', href: '/pdf' },
      { label: 'Pricing', href: '/article' },
      { label: 'Explorer', href: '/search' },
      { label: 'Resources', href: '/about' },
    ],
    actions: {
      primary: { label: 'Browse library', href: '/pdf' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: '',
    description: 'Filingone brings together document posts, article-style reading, and practical discovery in one polished space.',
    columns: [
      {
        title: '',
        links: [
          
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: '',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
