'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export function EditableShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-[#1a32631f] bg-white px-4 py-2 text-xs font-black text-[var(--slot4-page-text)] transition hover:-translate-y-0.5"
      aria-label="Copy page link"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? 'Copied' : 'Share'}
    </button>
  )
}
