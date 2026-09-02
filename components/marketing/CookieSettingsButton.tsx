'use client';

import { openCookieSettings } from '@/lib/cookie-consent';

export default function CookieSettingsButton({
  className = '',
  children = 'Cookie settings',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
