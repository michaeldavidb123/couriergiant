import Link from 'next/link';
import { SITE } from '@/lib/site-config';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const text = size === 'sm' ? 'text-base' : 'text-lg';
  const mark = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-semibold tracking-tight ${text}`}>
      <span
        className={`w-8 h-8 rounded-xl bg-[#0d9488] text-white flex items-center justify-center font-extrabold tracking-tight ${mark}`}
        aria-hidden
      >
        CG
      </span>
      {SITE.name}
    </Link>
  );
}
