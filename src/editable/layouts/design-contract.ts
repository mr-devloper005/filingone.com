import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f2ea',
  '--slot4-page-text': '#121a2a',
  '--slot4-panel-bg': '#fffaf2',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5e6673',
  '--slot4-soft-muted-text': '#6b6458',
  '--slot4-accent': '#1a3263',
  '--slot4-accent-fill': '#547792',
  '--slot4-accent-soft': '#ffc570',
  '--slot4-dark-bg': '#0b0f16',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#d9e3eb',
  '--slot4-cream': '#fff4d8',
  '--slot4-warm': '#efd2b0',
  '--slot4-lavender': '#d8e5f2',
  '--slot4-gray': '#eef1f5',
  '--slot4-body-gradient':
    'radial-gradient(circle at top left, rgba(255,197,112,0.35), transparent 36%), radial-gradient(circle at top right, rgba(84,119,146,0.22), transparent 30%), linear-gradient(180deg, #fbf7f0 0%, #f7f2ea 34%, #eff4f8 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[#1a32631f]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_18px_50px_rgba(26,50,99,0.08)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(11,15,22,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(10,14,22,0.08),rgba(10,14,22,0.76))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[148px] shrink-0 snap-start sm:w-[176px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl lg:text-[4.5rem]',
    sectionTitle: 'text-2xl font-black tracking-[-0.05em] sm:text-3xl lg:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[1.75rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.75rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[1.9rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full bg-[var(--slot4-accent)] px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#10213f]`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-7 py-3 text-sm font-black ${editablePalette.surfaceText} transition hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-105`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.35rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(26,50,99,0.14)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all editable pages consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the homepage can be redesigned as one editorial system.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing and pair them with strong feature cards.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
