import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Come meet me for food and good company'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(180deg, #fff3f4 0%, #fff8ef 100%)',
          color: '#3a2725',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          padding: 64,
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: '#fffdf9',
            border: '3px dashed #f0bdc4',
            borderRadius: 44,
            boxShadow: '0 30px 90px rgba(140, 76, 84, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            padding: '56px 72px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              background: '#ffe3e8',
              border: '2px solid #efc5ca',
              borderRadius: 999,
              color: '#9a5b61',
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 34,
              padding: '14px 28px',
            }}
          >
            To all my friends
          </div>
          <div
            style={{
              color: '#3a2725',
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: '-1px',
              lineHeight: 1.08,
              maxWidth: 920,
            }}
          >
            Come meet me for food and good company.
          </div>
          <div
            style={{
              color: '#7b5a55',
              fontSize: 32,
              lineHeight: 1.45,
              marginTop: 34,
              maxWidth: 820,
            }}
          >
            I have missed you. Let us share a meal, laugh together, and stay closer from now on.
          </div>
        </div>
      </div>
    ),
    size
  )
}
