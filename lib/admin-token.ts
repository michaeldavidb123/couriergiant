function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? normalized : normalized + '='.repeat(4 - (normalized.length % 4));
  if (typeof atob === 'function') {
    return atob(pad);
  }
  return Buffer.from(pad, 'base64').toString('utf8');
}

/** Checks JWT shape and expiry (signature verified by API on data requests). */
export function isAdminTokenValid(token: string | undefined | null): boolean {
  if (!token?.trim()) return false;
  const parts = token.trim().split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number };
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}
