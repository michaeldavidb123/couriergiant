'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function TrackingInputForm({ className = '', initialId = '' }: { className?: string; initialId?: string }) {
  const [id, setId] = useState(initialId);
  const router = useRouter();

  useEffect(() => {
    setId(initialId);
  }, [initialId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) return;
    router.push(`/tracking?id=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={submit} className={`mk-track-box ${className}`}>
      <input
        className="mk-input"
        placeholder="Enter tracking ID e.g. EG123456789IN"
        value={id}
        onChange={(e) => setId(e.target.value)}
        aria-label="Tracking ID"
      />
      <button type="submit" className="mk-btn mk-btn--primary shrink-0">
        Track
      </button>
    </form>
  );
}

function TrackingInputWithParams({ className = '' }: { className?: string }) {
  const searchParams = useSearchParams();
  return <TrackingInputForm className={className} initialId={searchParams.get('id') ?? ''} />;
}

export default function TrackingInput({ className = '' }: { className?: string }) {
  return (
    <Suspense fallback={<TrackingInputForm className={className} />}>
      <TrackingInputWithParams className={className} />
    </Suspense>
  );
}

export function useTrackingIdParam(): string {
  const searchParams = useSearchParams();
  return (searchParams.get('id') ?? '').trim();
}
