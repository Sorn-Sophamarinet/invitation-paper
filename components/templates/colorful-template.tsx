'use client'

import { formatDate, formatTime } from '@/lib/utils'

interface TemplateProps {
  data: {
    hostName: string
    guestName: string
    date: string
    time: string
    location: string
    dress: string
    customMessage: string
  }
}

export default function ColorfulTemplate({ data }: TemplateProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#ff4d8d_0%,#ffc857_48%,#17c9c3_100%)] p-6 text-[#111525] md:p-12">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/92 p-6 shadow-2xl md:p-10">
        <div className="grid grid-cols-[1fr_auto] gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ff4d8d]">Color pop</p>
            <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">Party mode</h1>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#111525] text-sm font-black uppercase tracking-wider text-white">
            On
          </div>
        </div>

        <p className="mt-8 text-2xl font-black">Dear {data.guestName},</p>
        <p className="mt-3 text-lg leading-8 text-[#4b5568]">
          {data.hostName} saved you a spot for a bright night with good people and better memories.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#111525] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#17c9c3]">When</p>
            <p className="mt-3 text-xl font-black">{formatDate(data.date)}</p>
            <p className="text-white/70">{formatTime(data.time)}</p>
          </div>
          <div className="rounded-2xl bg-[#fff3bf] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff4d8d]">Where</p>
            <p className="mt-3 text-xl font-black">{data.location}</p>
          </div>
          <div className="rounded-2xl bg-[#eafcff] p-5 sm:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f8f8a]">Dress code</p>
            <p className="mt-3 text-xl font-black">{data.dress}</p>
          </div>
        </div>

        {data.customMessage && (
          <div className="mt-6 rounded-2xl bg-[#ffe8f1] p-5">
            <p className="text-lg font-bold leading-8">{data.customMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}
