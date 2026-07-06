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

export default function ClassicTemplate({ data }: TemplateProps) {
  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-white md:p-12">
      <div className="mx-auto max-w-2xl border border-white/20 bg-[#121b31] p-6 md:p-10">
        <div className="border border-[#ffc857]/60 p-6 md:p-10">
          <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#ffc857]">Midnight lounge</p>
          <h1 className="mx-auto mt-6 max-w-lg text-center text-5xl font-black leading-none md:text-7xl">
            A night out with friends
          </h1>

          <div className="my-8 h-px bg-white/20" />

          <div className="text-center">
            <p className="text-white/62">Hosted by</p>
            <p className="mt-2 text-3xl font-black">{data.hostName}</p>
            <p className="mt-8 text-white/62">Reserved for</p>
            <p className="mt-2 text-2xl font-black text-[#17c9c3]">{data.guestName}</p>
          </div>

          <div className="my-8 grid gap-4 text-center sm:grid-cols-2">
            <div className="border border-white/14 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">Date</p>
              <p className="mt-2 font-semibold">{formatDate(data.date)}</p>
            </div>
            <div className="border border-white/14 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">Time</p>
              <p className="mt-2 font-semibold">{formatTime(data.time)}</p>
            </div>
            <div className="border border-white/14 p-4 sm:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc857]">Venue</p>
              <p className="mt-2 text-xl font-black">{data.location}</p>
            </div>
          </div>

          <p className="text-center text-sm uppercase tracking-[0.2em] text-white/58">{data.dress}</p>
          {data.customMessage && (
            <p className="mt-8 text-center text-lg leading-8 text-white/75">
              {data.customMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
