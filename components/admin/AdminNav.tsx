'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Inbox, Mail, Package, Plus } from 'lucide-react';

const LINKS = [
  { href: '/admin/parcels', label: 'Parcels', icon: Package },
  { href: '/admin/parcels/new', label: 'New parcel', icon: Plus },
  { href: '/admin/mail/inbox', label: 'Inbox', icon: Inbox },
  { href: '/admin/mail', label: 'Send mail', icon: Mail },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
];

function linkIsActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/admin/parcels') {
    return pathname === '/admin/parcels' || pathname === '/admin' || Boolean(pathname.match(/^\/admin\/parcels\/(?!new$)[^/]+$/));
  }
  if (href === '/admin/mail') return pathname === '/admin/mail';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="vr-admin__nav" aria-label="Admin">
      {LINKS.map((link) => {
        const active = linkIsActive(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} className={active ? 'is-active' : undefined}>
            <Icon />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
