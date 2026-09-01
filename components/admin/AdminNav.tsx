'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Mail, Package, Plus } from 'lucide-react';

const LINKS = [
  { href: '/admin/parcels', label: 'Parcels', icon: Package },
  { href: '/admin/parcels/new', label: 'New parcel', icon: Plus },
  { href: '/admin/mail', label: 'Send mail', icon: Mail },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="vr-admin__nav" aria-label="Admin">
      {LINKS.map((link) => {
        const active =
          link.href === '/admin/parcels'
            ? pathname === '/admin/parcels' || pathname === '/admin' || Boolean(pathname?.match(/^\/admin\/parcels\/(?!new$)[^/]+$/))
            : pathname === link.href || (link.href !== '/admin/parcels/new' && pathname?.startsWith(link.href));
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
