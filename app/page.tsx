import type { Metadata } from 'next'
import { CalendarDays, Coffee, Heart, MapPin, MessageCircle, Sparkles, Utensils } from 'lucide-react'

const productionUrl = 'https://invitation09.vercel.app'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}`
  : productionUrl
const eventDate = 'Sunday, July 20, 2026'
const eventTime = '6:00 PM'
const eventPlace = 'A cozy food place together'
const ogImageUrl = `${siteUrl}/opengraph-image`

type PageProps = {
  searchParams?: Promise<{
    name?: string | string[]
  }>
}

function getFriendName(name?: string | string[]) {
  const rawName = Array.isArray(name) ? name[0] : name
  const cleanName = rawName?.trim().slice(0, 40)

  return cleanName || 'friends'
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const friendName = getFriendName(params?.name)
  const isPersonal = friendName.toLowerCase() !== 'friends'
  const inviteUrl = isPersonal
    ? `${siteUrl}/?name=${encodeURIComponent(friendName)}`
    : siteUrl
  const title = isPersonal
    ? `${friendName}, this invitation is for you`
    : 'A warm invitation for my friends'
  const description = isPersonal
    ? `${friendName}, I miss you. Come meet me for food, good company, and a warm catch-up.`
    : 'I miss you. Come meet me for food, good company, and a warm catch-up with friends.'

  return {
    title,
    description,
    alternates: {
      canonical: inviteUrl,
    },
    openGraph: {
      title,
      description,
      url: inviteUrl,
      siteName: 'Friends Gathering Invitation',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Cute invitation card that says Come meet me for food and good company',
          type: 'image/png',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const friendName = getFriendName(params?.name)
  const isPersonal = friendName.toLowerCase() !== 'friends'

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff3f4] text-[#3a2725]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-5 py-10 md:px-8">
        <div className="pointer-events-none absolute left-5 top-10 h-20 w-20 rounded-full bg-[#ffd7df] opacity-70 blur-2xl" />
        <div className="pointer-events-none absolute bottom-16 right-8 h-28 w-28 rounded-full bg-[#ffe3b7] opacity-80 blur-2xl" />

        <div className="relative rounded-[2rem] border border-[#f2cfd3] bg-[#fffaf5] p-4 shadow-[0_28px_90px_rgba(140,76,84,0.18)] md:p-6">
          <div className="rounded-[1.6rem] border-2 border-dashed border-[#f0bdc4] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7f2_100%)] px-5 py-8 md:px-10 md:py-12 lg:px-14">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-7 flex items-center justify-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#eaa0a9]" />
                <p className="inline-flex items-center gap-2 rounded-full border border-[#efc5ca] bg-white px-4 py-2 text-sm font-black text-[#9a5b61] shadow-sm">
                  <Heart className="h-4 w-4 fill-[#f4a9b2] text-[#9a5b61]" />
                  {isPersonal ? `For ${friendName}` : 'To all my friends'}
                </p>
                <span className="h-3 w-3 rounded-full bg-[#f3c279]" />
              </div>

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe3e8] text-[#9a5b61] shadow-sm">
                <Sparkles className="h-7 w-7" />
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-normal text-[#3a2725] md:text-6xl">
                Hello {friendName} 🩵,
              </h1>

              <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-[#3a2725] md:text-6xl">
                Come meet me for food and good company.
              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#7b5a55] md:text-xl md:leading-9">
                I have missed you more than I knew how to say. Life has been moving so fast, and I miss those small,
                happy moments with everyone: sitting close, eating something good, laughing at old memories, and feeling
                like no time has passed.
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#7b5a55]">
                I would really love for us to share a meal, talk without rushing, laugh a little louder, and keep each
                other closer from now on.
              </p>

              <div className="mx-auto mt-9 max-w-2xl rounded-[1.75rem] border border-[#f0cdd1] bg-white p-4 text-left shadow-[0_14px_34px_rgba(140,76,84,0.1)]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fff3f4] p-5">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#9a5b61]">
                      <CalendarDays className="h-4 w-4" />
                      Date and time
                    </p>
                    <p className="mt-3 text-xl font-black text-[#3a2725]">{eventDate}</p>
                    <p className="mt-1 text-base font-bold text-[#7b5a55]">{eventTime}</p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8eb] p-5">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#9a5b61]">
                      <MapPin className="h-4 w-4" />
                      Place
                    </p>
                    <p className="mt-3 text-xl font-black text-[#3a2725]">{eventPlace}</p>
                    <p className="mt-1 text-base font-bold text-[#7b5a55]">I will share the exact spot soon.</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-5 grid max-w-3xl gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#f0cdd1] bg-white p-5 text-center shadow-[0_10px_28px_rgba(140,76,84,0.08)]">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3e8] text-[#9a5b61]">
                    <Utensils className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9a5b61]">Eat</p>
                  <p className="mt-2 text-sm leading-6 text-[#7b5a55]">Something delicious we can share.</p>
                </div>
                <div className="rounded-3xl border border-[#f0cdd1] bg-white p-5 text-center shadow-[0_10px_28px_rgba(140,76,84,0.08)]">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0cf] text-[#9a6a22]">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9a5b61]">Relax</p>
                  <p className="mt-2 text-sm leading-6 text-[#7b5a55]">No rush, no pressure, just us.</p>
                </div>
                <div className="rounded-3xl border border-[#f0cdd1] bg-white p-5 text-center shadow-[0_10px_28px_rgba(140,76,84,0.08)]">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3e8] text-[#9a5b61]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9a5b61]">Talk</p>
                  <p className="mt-2 text-sm leading-6 text-[#7b5a55]">Real conversation, not quick replies.</p>
                </div>
              </div>

              <div className="mx-auto mt-9 max-w-xl rounded-[1.5rem] border border-[#f0cdd1] bg-[#ffe8ec] px-6 py-5 shadow-[0_14px_34px_rgba(140,76,84,0.12)]">
                <p className="text-lg font-black leading-8 text-[#6f3f45]">
                  Please come as you are. I really want to see everyone again 🥺
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
