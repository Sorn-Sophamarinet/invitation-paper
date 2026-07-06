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

export default function CasualTemplate({ data }: TemplateProps) {
  return (
    <div className="min-h-screen bg-[#fff8e8] p-6 text-[#172033] md:p-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 grid grid-cols-[1fr_auto] items-start gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f15a3b]">House party</p>
            <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">You in?</h1>
          </div>
          <div className="rounded-full bg-[#17c9c3] px-5 py-3 text-sm font-black text-white shadow-lg">VIP</div>
        </div>

        <div className="rounded-3xl border-2 border-[#172033] bg-white p-6 shadow-[10px_10px_0_#172033] md:p-8">
          <p className="text-xl font-black">For {data.guestName}</p>
          <p className="mt-4 text-lg leading-8 text-[#4f5b70]">
            {data.hostName} is gathering the crew. Come for the playlist, stay for the laughs.
          </p>
          {data.customMessage && (
            <p className="mt-5 rounded-2xl bg-[#fff0f6] p-4 font-semibold leading-7 text-[#172033]">
              {data.customMessage}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#172033] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc857]">Date</p>
            <p className="mt-3 text-lg font-black">{formatDate(data.date)}</p>
          </div>
          <div className="rounded-2xl bg-[#ff4d8d] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Time</p>
            <p className="mt-3 text-lg font-black">{formatTime(data.time)}</p>
          </div>
          <div className="rounded-2xl bg-[#17c9c3] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Fit</p>
            <p className="mt-3 text-lg font-black">{data.dress}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-[#172033] bg-[#ffc857] p-5 shadow-[7px_7px_0_#172033]">
          <p className="text-xs font-black uppercase tracking-[0.16em]">Meet here</p>
          <p className="mt-2 text-2xl font-black">{data.location}</p>
        </div>
      </div>
    </div>
  )
}
