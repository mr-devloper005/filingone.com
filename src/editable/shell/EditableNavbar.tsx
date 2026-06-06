'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState, type CSSProperties } from 'react'
import { LogIn, Menu, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [
      { label: 'Features', href: '/pdf' },
      { label: 'Explorer', href: '/search' },
      {label: 'Help' , href:'/contact'}
    ], 
    []
  )
  const navVars = {
    '--editable-nav-bg': '#0a0d14',
    '--editable-nav-text': '#ffffff',
    '--editable-nav-active': '#ffffff',
    '--editable-nav-active-text': '#0a0d14',
    '--editable-cta-bg': '#ffffff',
    '--editable-cta-text': '#0a0d14',
    '--editable-search-bg': 'rgba(255,255,255,0.08)',
    '--editable-border': 'rgba(255,255,255,0.16)',
    '--editable-container': '1440px',
  } as CSSProperties

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] shadow-[0_10px_30px_rgba(0,0,0,0.16)]">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.2rem] bg-white">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-base font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-white/55">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto hidden min-w-0 max-w-[430px] flex-1 md:flex">
          <label className="flex w-full items-center rounded-full border border-white/15 bg-[var(--editable-search-bg)] px-4 py-2.5 backdrop-blur">
            <Search className="h-4 w-4 text-white/60" />
            <input
              name="q"
              type="search"
              placeholder="Search documents"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-white/40"
            />
          </label>
        </form>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${active ? 'bg-white text-[var(--editable-nav-active-text)]' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
         
          {session ? (
            <>
              <Link href="/create" className="hidden rounded-full bg-white px-4 py-2.5 text-sm font-black text-[var(--editable-nav-active-text)] transition hover:-translate-y-0.5 sm:inline-flex">
                Create
              </Link>
              <button type="button" onClick={logout} className="hidden rounded-full border border-white/15 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10 sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10 sm:inline-flex">
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-[var(--editable-nav-active-text)] transition hover:-translate-y-0.5 sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Free sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--editable-nav-bg)] px-4 py-4 lg:hidden">
          <form action="/search" className="flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-3">
            <Search className="h-4 w-4 text-white/60" />
            <input name="q" type="search" placeholder="Search documents" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-white/40" />
          </form>
          <div className="mt-4 grid gap-2">
            {[
              { label: 'Home', href: '/' },
              ...navItems,
              { label: 'Contact', href: '/contact' },
              ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }]),
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
