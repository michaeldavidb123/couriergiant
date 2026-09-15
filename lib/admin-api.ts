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
  message?: string | string[];
  error?: string | string[];
  details?: string | string[];
};

function asErrorParts(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(asErrorParts);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  if (value && typeof value === 'object' && 'message' in value) {
    return asErrorParts((value as { message?: unknown }).message);
  }
  return [];
}

function unwrapError(json: ApiEnvelope<unknown> | null, fallback: string) {
  const parts = [
    ...asErrorParts(json?.error),
    ...asErrorParts(json?.message),
    ...asErrorParts(json?.details),
    ...asErrorParts((json?.data as { message?: unknown } | undefined)?.message),
  ];
  const unique = [...new Set(parts.filter((part) => part && part !== 'Bad Request'))];
  return unique.join('. ') || fallback;
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
    throw new Error('This account is not a CourierGiant admin');
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
    throw new Error('This account is not a CourierGiant admin');
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

export type MailChannel = 'platform' | 'courier' | string;

export type InboundMailMessage = {
  id: string;
  fromAddress?: string | null;
  toAddresses?: string[] | string | null;
  ccAddresses?: string[] | string | null;
  subject?: string | null;
  textBody?: string | null;
  htmlBody?: string | null;
  readAt?: string | null;
  createdAt?: string | null;
  channel?: MailChannel | null;
};

export type OutboundMailMessage = {
  id: string;
  fromAddress?: string | null;
  toAddress?: string | null;
  toAddresses?: string[] | string | null;
  subject?: string | null;
  textBody?: string | null;
  htmlBody?: string | null;
  createdAt?: string | null;
  channel?: MailChannel | null;
  status?: string | null;
  provider?: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return null;
}

export function mailAddresses(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(mailAddresses);
  if (typeof value === 'string') {
    return value
      .split(/[,;]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  const obj = asRecord(value);
  if (!obj) return [];
  return mailAddresses(obj.email || obj.address || obj.value || obj.to);
}

function asMailList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const obj = asRecord(payload);
  if (!obj) return [];
  for (const key of ['items', 'messages', 'inbound', 'outbound', 'rows', 'emails', 'data']) {
    if (Array.isArray(obj[key])) return obj[key] as T[];
  }
  if (obj.id) return [payload as T];
  return [];
}

function unwrapMailRecord(payload: unknown): Record<string, unknown> | null {
  const obj = asRecord(payload);
  if (!obj) return null;
  for (const key of ['message', 'inbound', 'outbound', 'email', 'item']) {
    const nested = asRecord(obj[key]);
    if (nested) return nested;
  }
  return obj;
}

function normalizeInboundMail(raw: unknown): InboundMailMessage | null {
  const obj = unwrapMailRecord(raw);
  if (!obj) return null;
  const id = firstString(obj.id, obj.emailId, obj.email_id);
  if (!id) return null;
  return {
    id,
    fromAddress: firstString(obj.fromAddress, obj.from_address, obj.from),
    toAddresses: (obj.toAddresses || obj.to_addresses || obj.to || obj.recipients) as InboundMailMessage['toAddresses'],
    ccAddresses: (obj.ccAddresses || obj.cc_addresses || obj.cc) as InboundMailMessage['ccAddresses'],
    subject: firstString(obj.subject),
    textBody: firstString(obj.textBody, obj.text_body, obj.text, obj.body),
    htmlBody: firstString(obj.htmlBody, obj.html_body, obj.html),
    readAt: firstString(obj.readAt, obj.read_at),
    createdAt: firstString(obj.createdAt, obj.created_at, obj.receivedAt, obj.received_at),
    channel: firstString(obj.channel),
  };
}

function normalizeOutboundMail(raw: unknown): OutboundMailMessage | null {
  const obj = unwrapMailRecord(raw);
  if (!obj) return null;
  const id = firstString(obj.id, obj.emailId, obj.email_id);
  if (!id) return null;
  return {
    id,
    fromAddress: firstString(obj.fromAddress, obj.from_address, obj.from),
    toAddress: firstString(obj.toAddress, obj.to_address, obj.to),
    toAddresses: (obj.toAddresses || obj.to_addresses || obj.to || obj.recipients) as OutboundMailMessage['toAddresses'],
    subject: firstString(obj.subject),
    textBody: firstString(obj.textBody, obj.text_body, obj.text, obj.body),
    htmlBody: firstString(obj.htmlBody, obj.html_body, obj.html),
    createdAt: firstString(obj.createdAt, obj.created_at, obj.sentAt, obj.sent_at),
    channel: firstString(obj.channel),
    status: firstString(obj.status, obj.deliveryStatus, obj.delivery_status),
    provider: firstString(obj.provider),
  };
}

export function isCourierGiantInbound(message: InboundMailMessage): boolean {
  if ((message.channel || '').toLowerCase() === 'courier') return true;
  return mailAddresses(message.toAddresses).some((addr) => addr.toLowerCase().includes('couriergiant.com'));
}

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
  listInboundMail(params: { limit?: number; unread?: boolean } = {}) {
    const query = new URLSearchParams();
    query.set('limit', String(params.limit ?? 80));
    if (params.unread) query.set('unread', 'true');
    return adminFetch<unknown>(`/admin/mail/webhooks/inbound?${query.toString()}`).then((res) => ({
      messages: asMailList<unknown>(res).map(normalizeInboundMail).filter((row): row is InboundMailMessage => Boolean(row)),
    }));
  },
  getInboundMail(id: string) {
    return adminFetch<unknown>(`/admin/mail/webhooks/inbound/${encodeURIComponent(id)}`).then((res) => ({
      message: normalizeInboundMail(res),
    }));
  },
  markInboundMailRead(id: string) {
    return adminFetch<unknown>(`/admin/mail/webhooks/inbound/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    }).then((res) => ({
      message: normalizeInboundMail(res),
    }));
  },
  listOutboundMail(params: { limit?: number; channel?: string } = {}) {
    const query = new URLSearchParams();
    query.set('limit', String(params.limit ?? 80));
    query.set('channel', params.channel || 'courier');
    return adminFetch<unknown>(`/admin/mail/webhooks/outbound?${query.toString()}`).then((res) => ({
      messages: asMailList<unknown>(res).map(normalizeOutboundMail).filter((row): row is OutboundMailMessage => Boolean(row)),
    }));
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
