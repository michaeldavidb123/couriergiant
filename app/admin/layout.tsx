'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { adminLogout, adminMe } from '@/lib/admin-api';
import { getAdminUser } from '@/lib/admin-auth';
import { SITE } from '@/lib/site-config';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(getAdminUser()?.email || '');

  useEffect(() => {
    let cancelled = false;
    adminMe()
      .then((user) => {
        if (cancelled) return;
        setEmail(user.email);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        adminLogout();
        router.replace('/admin/login');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const logout = () => {
    adminLogout();
    router.replace('/admin/login');
  };

  if (!ready) {
    return (
      <div className="vr-admin vr-admin--loading">
        <p>Checking admin session…</p>
      </div>
    );
  }

  return (
    <div className="vr-admin">
      <header className="vr-admin__bar">
        <Link href="/admin" className="vr-admin__brand">
          <span className="vr-admin__mark">
            <Image src="/brand/couriergiant-mark.png" alt="" width={32} height={32} priority />
          </span>
          {SITE.name}
          <em>Admin</em>
        </Link>
        <div className="vr-admin__meta">
          <span>{email}</span>
          <Link href="/tracking">Tracking</Link>
          <button type="button" onClick={logout}>
            <LogOut />
            Sign out
          </button>
        </div>
      </header>
      <AdminNav />
      <main className="vr-admin__main">{children}</main>
    </div>
  );
}
