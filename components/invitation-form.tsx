'use client'

import type { ChangeEvent, ReactNode } from 'react'
import { CalendarDays, MapPin, MessageSquareText, Shirt, Sparkles, UserRound, UsersRound } from 'lucide-react'

interface InvitationFormProps {
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
  onChange: (data: any) => void
}

export default function InvitationForm({ data, onChange }: InvitationFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ ...data, [name]: value })
  }

  const fieldClass =
    'w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15'

  const LabelIcon = ({ children }: { children: ReactNode }) => (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {children}
    </span>
  )

  return (
    <div className="rounded-xl border border-border bg-card/95 p-5 shadow-[0_20px_60px_rgba(22,31,51,0.08)] backdrop-blur md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-foreground">Invite details</h2>
          <p className="text-sm text-muted-foreground">Tune the card before you send it.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><UserRound className="h-4 w-4" /></LabelIcon>
            Your name
          </label>
          <input
            type="text"
            name="hostName"
            value={data.hostName}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Who is hosting?"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><UsersRound className="h-4 w-4" /></LabelIcon>
            Friend name
          </label>
          <input
            type="text"
            name="guestName"
            value={data.guestName}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Who gets the invite?"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <LabelIcon><CalendarDays className="h-4 w-4" /></LabelIcon>
              Date
            </label>
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <LabelIcon><Sparkles className="h-4 w-4" /></LabelIcon>
              Time
            </label>
            <input
              type="time"
              name="time"
              value={data.time}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><MapPin className="h-4 w-4" /></LabelIcon>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Venue, home, rooftop, cafe..."
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><Shirt className="h-4 w-4" /></LabelIcon>
            Dress code
          </label>
          <input
            type="text"
            name="dress"
            value={data.dress}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Party casual, all black, glam..."
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><Sparkles className="h-4 w-4" /></LabelIcon>
            Style
          </label>
          <select
            name="template"
            value={data.template}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="modern">Neon Night</option>
            <option value="casual">House Party</option>
            <option value="classic">Midnight Lounge</option>
            <option value="colorful">Color Pop</option>
          </select>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <LabelIcon><MessageSquareText className="h-4 w-4" /></LabelIcon>
            Message
          </label>
          <textarea
            name="customMessage"
            value={data.customMessage}
            onChange={handleChange}
            rows={4}
            className={`${fieldClass} resize-none leading-6`}
            placeholder="Add the vibe, plan, or personal note..."
          />
        </div>
      </div>
    </div>
  )
}
