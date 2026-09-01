import {
  apiRoot,
  type CourierParcel,
  type CourierParcelPayload,
} from '@/lib/parcels-api';
import {
  clearAdminSession,
  getAdminToken,
  isAdminRole,
  persistAdminSession,
  type AdminUser,
} from '@/lib/admin-auth';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

function unwrapError(json: ApiEnvelope<unknown> | null, fallback: string) {
  const message = json?.error || json?.message || (json?.data as { message?: string } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
}

async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${apiRoot()}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (res.status === 401) {
    clearAdminSession();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error(unwrapError(json, 'Please sign in again'));
  }

  if (!res.ok) {
    throw new Error(unwrapError(json, 'Request failed'));
  }

  return (json?.data ?? json) as T;
}

export async function adminLogin(email: string, password: string) {
  const data = await adminFetch<{
    access_token: string;
    user: AdminUser;
    profile?: { userRole?: string; user_role?: string; hasAdminPrivileges?: boolean };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  const role = data.user?.role || data.profile?.userRole || data.profile?.user_role;
  if (!isAdminRole(role, data.profile?.hasAdminPrivileges)) {
    throw new Error('This account is not a VeloRoute admin');
  }

  persistAdminSession(data.access_token, data.user);
  return data.user;
}

export async function adminMe() {
  const data = await adminFetch<{
    user: AdminUser;
    profile?: { userRole?: string; hasAdminPrivileges?: boolean };
  }>('/auth/me');
  const role = data.user?.role || data.profile?.userRole;
  if (!isAdminRole(role, data.profile?.hasAdminPrivileges)) {
    clearAdminSession();
    throw new Error('This account is not a VeloRoute admin');
  }
  const token = getAdminToken();
  if (token) persistAdminSession(token, data.user);
  return data.user;
}

export function adminLogout() {
  clearAdminSession();
}

export type UgcUser = {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
  userRole: string;
  companyName?: string | null;
};

export type SmtpSettingsView = {
  host: string | null;
  port: number | null;
  user: string | null;
  from: string | null;
  replyTo: string | null;
  secure: boolean;
  passConfigured: boolean;
};

export type CourierSettings = {
  siteUrl: string;
  allowedOrigins: string[];
  adminEmail?: string | null;
  smtp?: SmtpSettingsView;
  message?: string;
};

export const parcelsAdminApi = {
  list() {
    return adminFetch<{ parcels: CourierParcel[]; total: number }>('/parcels/admin');
  },
  get(id: string) {
    return adminFetch<{ parcel: CourierParcel }>(`/parcels/admin/${id}`);
  },
  create(body: CourierParcelPayload) {
    return adminFetch<{ parcel: CourierParcel; message?: string }>('/parcels', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  update(id: string, body: Partial<CourierParcelPayload>) {
    return adminFetch<{ parcel: CourierParcel; message?: string }>(`/parcels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  remove(id: string) {
    return adminFetch<{ message: string }>(`/parcels/${id}`, { method: 'DELETE' });
  },
  seedDefaults() {
    return adminFetch<{ message: string; total: number }>('/parcels/seed', { method: 'POST' });
  },
  uploadImage(file: File) {
    const body = new FormData();
    body.append('file', file);
    return adminFetch<{ url: string; message?: string }>('/parcels/upload/image', {
      method: 'POST',
      body,
    });
  },
  uploadFile(file: File) {
    const body = new FormData();
    body.append('file', file);
    return adminFetch<{ url: string; title?: string; fileName?: string; message?: string }>('/parcels/upload/file', {
      method: 'POST',
      body,
    });
  },
  getSettings() {
    return adminFetch<CourierSettings>('/parcels/settings');
  },
  updateSettings(body: {
    siteUrl: string;
    allowedOrigins?: string[];
    adminEmail?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    smtpFrom?: string;
    smtpReplyTo?: string;
    smtpSecure?: boolean;
  }) {
    return adminFetch<CourierSettings>('/parcels/settings', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  action(
    id: string,
    action:
      | 'pause'
      | 'resume'
      | 'resume_auto'
      | 'move_forward'
      | 'move_back'
      | 'hold'
      | 'cancel'
      | 'hide'
      | 'show'
      | 'deliver',
  ) {
    return adminFetch<{ parcel: CourierParcel; message?: string }>(`/parcels/${id}/actions`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
  sendMail(body: { to: string; subject: string; message: string; parcelId?: string }) {
    return adminFetch<{ message: string; provider?: string }>('/parcels/mail', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  createDocument(body: { parcelId: string; title: string; kind?: string; content?: string; url?: string }) {
    return adminFetch<{ parcel: CourierParcel; message?: string }>('/parcels/documents', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  planRoute(body: {
    originLabel: string;
    destLabel: string;
    originCountry?: string;
    destCountry?: string;
    totalHours: number;
    serviceType?: string;
    startAt?: string;
  }) {
    return adminFetch<{
      originCountry?: string | null;
      destCountry?: string | null;
      originLat?: number | null;
      originLng?: number | null;
      destLat?: number | null;
      destLng?: number | null;
      international?: boolean;
      borders?: string[];
      summary?: string;
      totalHours: number;
      events: Array<{
        title: string;
        statusKey: string;
        iconKey: string;
        landmarkKind: string;
        locationLabel: string;
        lat?: number | null;
        lng?: number | null;
        notes?: string | null;
        durationHours: number;
        windowStart: string;
        windowEnd: string;
        isCompleted?: boolean;
        isCurrent?: boolean;
      }>;
      message?: string;
    }>('/parcels/route-plan', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  listUsers(params: { q?: string; role?: string } = {}) {
    const query = new URLSearchParams();
    query.set('limit', '100');
    if (params.q) query.set('q', params.q);
    if (params.role) query.set('role', params.role);
    return adminFetch<{ users?: UgcUser[]; data?: { users?: UgcUser[] }; pagination?: { total: number } }>(
      `/admin/users?${query.toString()}`,
    ).then((res) => {
      const users = res.users || res.data?.users || [];
      return { users, pagination: res.pagination || { total: users.length } };
    });
  },
};
