import { apiRoot } from './parcels-api';

export type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
  company?: string;
};

export async function submitContact(payload: ContactPayload): Promise<{ message: string }> {
  const res = await fetch(`${apiRoot()}/marketing/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...payload, source: 'courier' }),
  });
  const json = await res.json().catch(() => null);
  const message =
    json?.data?.message ?? json?.message ?? (res.ok ? 'Thanks — we will respond shortly.' : 'Could not send your message.');
  if (!res.ok) {
    throw new Error(typeof message === 'string' ? message : 'Could not send your message.');
  }
  return { message: typeof message === 'string' ? message : 'Thanks — we will respond shortly.' };
}
