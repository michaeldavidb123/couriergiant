import Link from 'next/link';
import { Package } from 'lucide-react';
import { SITE, NAV_ITEMS } from '@/lib/site-config';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const text = size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-semibold tracking-tight ${text}`}>
      <span className="w-8 h-8 rounded-xl bg-[#111] text-white flex items-center justify-center">
        <Package className="w-4 h-4" strokeWidth={2} />
      </span>
      {SITE.name}
    </Link>
  );
}
