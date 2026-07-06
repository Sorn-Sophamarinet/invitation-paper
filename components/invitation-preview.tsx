'use client'

import { useState } from 'react'
import { Check, Copy, Printer } from 'lucide-react'
import ModernTemplate from './templates/modern-template'
import CasualTemplate from './templates/casual-template'
import ClassicTemplate from './templates/classic-template'
import ColorfulTemplate from './templates/colorful-template'

interface InvitationPreviewProps {
  data: {
    hostName: string
    guestName: string
    date: string
    time: string
    location: string
    dress: string
    template: string
    customMessage: string
  }
}

export default function InvitationPreview({ data }: InvitationPreviewProps) {
  const [copied, setCopied] = useState(false)

  const getTemplate = () => {
    switch (data.template) {
      case 'casual':
        return <CasualTemplate data={data} />
      case 'classic':
        return <ClassicTemplate data={data} />
      case 'colorful':
        return <ColorfulTemplate data={data} />
      default:
        return <ModernTemplate data={data} />
    }
  }

  const generateShareLink = () => {
    const params = new URLSearchParams({
      host: data.hostName,
      guest: data.guestName,
      date: data.date,
      time: data.time,
      location: data.location,
      dress: data.dress,
      message: data.customMessage,
      template: data.template,
    })
    return `${window.location.origin}/invite?${params.toString()}`
  }

  const handleGenerateLink = async () => {
    const shareLink = generateShareLink()
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log('Copy failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_24px_80px_rgba(22,31,51,0.12)]">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-bold text-foreground">Live preview</p>
            <p className="text-xs text-muted-foreground">Ready to share</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff4d8d]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc857]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#17c9c3]" />
          </div>
        </div>
        <div className="h-[560px] overflow-y-auto bg-background">
          {getTemplate()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={handleGenerateLink}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-300 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>
    </div>
  )
}
