import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/site-config';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 28 : 36;
  const text = size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight text-zinc-900 ${text}`}
      aria-label={SITE.name}
    >
      <Image
        src="/brand/couriergiant-mark.png"
        alt=""
        width={px}
        height={px}
        className="rounded-[0.65rem] shadow-sm shadow-teal-900/10"
        priority
      />
      <span className="leading-none">
        <span className="font-extrabold tracking-tight">Courier</span>
        <span className="font-semibold tracking-tight text-teal-700">Giant</span>
      </span>
    </Link>
  );
}
