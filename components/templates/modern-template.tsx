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

export default function ModernTemplate({ data }: TemplateProps) {
  return (
    <div className="min-h-screen bg-[#111525] p-6 text-white md:p-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl flex-col justify-between rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,#18213a_0%,#101321_46%,#271736_100%)] p-6 shadow-2xl md:p-10">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#17c9c3]">Private party</p>
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff4d8d]" />
            <span className="h-3 w-3 rounded-full bg-[#ffc857]" />
            <span className="h-3 w-3 rounded-full bg-[#17c9c3]" />
          </div>
        </div>

        <div className="py-14">
          <p className="mb-4 text-base font-semibold text-white/70">Hey {data.guestName},</p>
          <h1 className="max-w-xl text-5xl font-black leading-[0.95] md:text-7xl">
            Pull up, the night is yours.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/72">
            {data.hostName} is bringing everyone together for music, food, photos, and a proper catch-up.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">When</p>
            <p className="mt-2 text-xl font-black">{formatDate(data.date)}</p>
            <p className="text-white/65">{formatTime(data.time)}</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">Where</p>
            <p className="mt-2 text-xl font-black">{data.location}</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/8 p-4 sm:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">Dress</p>
            <p className="mt-2 text-xl font-black">{data.dress}</p>
          </div>
        </div>

        {data.customMessage && (
          <p className="mt-8 border-l-4 border-[#ff4d8d] pl-5 text-lg font-semibold leading-8 text-white/84">
            {data.customMessage}
          </p>
        )}
      </div>
    </div>
  )
}
