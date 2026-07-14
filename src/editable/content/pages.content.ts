import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Filingone | Document library and careful reading',
      description: 'Explore PDFs, articles, and useful references through a premium editorial layout.',
      openGraphTitle: 'Filingone | Document library and careful reading',
      openGraphDescription: 'Browse documents, notes, and related reading through a polished editorial layout.',
      keywords: ['pdf library', 'document reading', 'editorial layout', 'document discovery'],
    },
    hero: {
      badge: '',
      title: ['Digital publishing', 'with a calm, classic feel.'],
      description: 'Browse PDFs, polished reading pieces, and saved references through a layout that gives every page room to breathe.',
      primaryCta: { label: 'Open PDF library', href: '/pdf' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search documents, topics, and titles',
      focusLabel: 'Featured issue',
      featureCardBadge: 'cover rail',
      featureCardTitle: 'Recent documents and reading pieces shape the front page.',
      featureCardDescription: 'Posts stay safe to render even when images or summaries are missing, so the library always feels complete.',
    },
    intro: {
      badge: 'How it works',
      title: 'A connected way to browse, read, and return to useful pages.',
      paragraphs: [
        'The experience combines a magazine-style homepage with a practical archive, so readers can move naturally from the front page into deeper sections.',
        'Cards change shape by context: some feel like covers, some like lists, and some like compact notes, which keeps browsing lively without becoming noisy.',
        'Every post renders safely with fallbacks for missing images, summaries, or categories, so the layout stays stable across the whole site.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Magazine hero with a centered cover rail and strong visual hierarchy.',
        'Mixed card styles for featured reads, compact notes, and image-led posts.',
        'Clean filters, chips, and pagination for quick archive browsing.',
        'Polished mobile layout with readable spacing and no awkward overflow.',
      ],
      primaryLink: { label: 'Browse documents', href: '/pdf' },
      secondaryLink: { label: 'Open search', href: '/search' },
    },
    cta: {
      badge: 'Keep reading',
      title: 'Explore more pages with the same calm rhythm.',
      description: 'Use the archive, search, and document sections to move through the site without losing the editorial pace.',
      primaryCta: { label: 'Explore the archive', href: '/article' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: { heading: 'Latest {label}', descriptionSuffix: 'Browse the newest posts in this section.' },
  },
  about: {
    badge: 'About FilingOne',
    title: 'The useful document should never be the hard one to find.',
    description: `${slot4BrandConfig.siteName} brings practical documents, guides, and reference material into one focused place—so you can spend less time searching and more time using what you find.`,
    paragraphs: [
      'We built FilingOne around a simple idea: important information is more valuable when it is easy to discover, understand, and return to. Every document is presented with the context you need to decide what is worth opening.',
      'Browse featured resources, explore the full document collection, or search by the words that matter to you. Clear categories and concise summaries keep the experience quick on desktop and mobile.',
      'Whether you are researching a topic, comparing guidance, or saving a useful reference for later, FilingOne helps you move from question to document without the usual clutter.',
    ],
    values: [
      {
        title: 'Reading-first layout',
        description: 'We prioritize clarity, pacing, and structure so people can read and browse without distraction.',
      },
      {
        title: 'Connected surfaces',
        description: 'Documents, posts, search, and supporting pages stay connected so discovery feels natural.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'Clean navigation and clear page structure help visitors find useful content faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach out with a note, request, or publishing idea.',
    description: 'Tell us what you want to share or improve, and we will route it through the right lane with a calm, practical response.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find documents and reading pieces faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to draft new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your reading space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
