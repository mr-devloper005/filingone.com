'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': 'rgba(255,255,255,0.78)',
    '--editable-footer-text': 'var(--slot4-page-text, #121a2a)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled) as Array<(typeof SITE_CONFIG.tasks)[number]>
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const footerColumns = (globalContent.footer?.columns || []) as unknown as Array<{ title: string; links: Array<{ label: string; href: string }> }>

  return (
    <footer style={footerVars} className="border-t border-[#1a32631f] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)] backdrop-blur">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] border border-[#1a326315] bg-white shadow-sm">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
              </span>
              <span>
                <span className="block text-lg font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{globalContent.footer?.tagline || SITE_CONFIG.tagline}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Site</h3>
            <div className="mt-4 grid gap-2">
              {footerColumns[1]?.links?.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-semibold text-[var(--slot4-page-text)]/75 transition hover:text-[var(--slot4-page-text)]">
                  {link.label}
                </Link>
              ))}
              {session ? <button type="button" onClick={logout} className="text-left text-sm font-semibold text-[var(--slot4-page-text)]/75 transition hover:text-[var(--slot4-page-text)]">Logout</button> : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#1a326315] pt-6 text-sm text-[var(--slot4-muted-text)] md:flex-row md:items-center md:justify-between">
          <p>{globalContent.footer?.bottomNote || `© ${year} ${SITE_CONFIG.name}.`}</p>
          <div className="flex flex-wrap gap-4">
            {taskLinks.slice(0, 4).map((task) => (
              <Link key={task.key} href={task.route} className="font-black text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
                {task.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
