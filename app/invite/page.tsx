'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { PartyPopper, Printer, RotateCcw } from 'lucide-react'
import ModernTemplate from '@/components/templates/modern-template'
import CasualTemplate from '@/components/templates/casual-template'
import ClassicTemplate from '@/components/templates/classic-template'
import ColorfulTemplate from '@/components/templates/colorful-template'

function InviteContent() {
  const searchParams = useSearchParams()
  
  const invitationData = {
    hostName: searchParams.get('host') || 'Your Host',
    guestName: searchParams.get('guest') || 'Friend',
    date: searchParams.get('date') || '2026-08-15',
    time: searchParams.get('time') || '20:00',
    location: searchParams.get('location') || 'Party Venue',
    dress: searchParams.get('dress') || 'Party casual',
    template: searchParams.get('template') || 'modern',
    customMessage: searchParams.get('message') || '',
  }

  const getTemplate = () => {
    switch (invitationData.template) {
      case 'casual':
        return <CasualTemplate data={invitationData} />
      case 'classic':
        return <ClassicTemplate data={invitationData} />
      case 'colorful':
        return <ColorfulTemplate data={invitationData} />
      default:
        return <ModernTemplate data={invitationData} />
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,#ff4d8d24,transparent_32%),radial-gradient(circle_at_90%_5%,#17c9c324,transparent_30%),linear-gradient(180deg,#f9fbff_0%,#eef3ff_100%)] p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-5 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-accent">
          <PartyPopper className="h-4 w-4" />
          You are invited
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_24px_80px_rgba(22,31,51,0.14)]">
          {getTemplate()}
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-bold text-background transition-colors hover:bg-foreground/90"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-center text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
            Create new
          </Link>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          main { background: white; padding: 0; }
          .sm\\:p-8, .p-4 { padding: 0 !important; }
          [class*="mt-"] { margin-top: 0 !important; }
          button, a { display: none !important; }
        }
      `}</style>
    </main>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading invitation...</div>}>
      <InviteContent />
    </Suspense>
  )
}
