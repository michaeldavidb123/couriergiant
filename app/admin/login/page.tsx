'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { adminLogin } from '@/lib/admin-api';
import { SITE } from '@/lib/site-config';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setLoading(false);
    }
  };

  return (
    <div className="vr-admin-login">
      <form onSubmit={onSubmit} className="vr-admin-login__card">
        <Link href="/" className="vr-admin__brand vr-admin__brand--center">
          <span className="vr-admin__mark">
            <Image src="/brand/couriergiant-mark.png" alt="" width={40} height={40} priority />
          </span>
          {SITE.name}
        </Link>
        <h1>Admin sign in</h1>
        <p>Manage parcels, journey landmarks, and public tracking.</p>
        {error && <p className="vr-admin-login__error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <span className="vr-admin-login__password">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </span>
        </label>
        <button type="submit" disabled={loading} className="vr-admin-btn vr-admin-btn--primary vr-admin-btn--block">
          {loading ? <Loader2 className="animate-spin" /> : null}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
