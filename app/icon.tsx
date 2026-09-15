import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0f766e 0%, #0d9488 55%, #14b8a6 100%)',
          borderRadius: 112,
          boxShadow: '0 24px 48px rgba(13, 148, 136, 0.35)',
        }}
      >
        <span
          style={{
            fontSize: 220,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.06em',
            transform: 'translateY(-8px)',
          }}
        >
          CG
        </span>
      </div>
    ),
    { ...size },
  );
}
