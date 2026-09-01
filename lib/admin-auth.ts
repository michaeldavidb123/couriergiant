const TOKEN_KEY = 'veloroute_admin_token';
const USER_KEY = 'veloroute_admin_user';
const COOKIE = 'veloroute_admin_token';

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  first_name?: string | null;
  last_name?: string | null;
};

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function isAdminRole(role?: string | null, hasAdminPrivileges?: boolean | null) {
  return role === 'admin' || Boolean(hasAdminPrivileges);
}

export function persistAdminSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${COOKIE}=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
