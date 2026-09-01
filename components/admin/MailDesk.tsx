'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parcelsAdminApi } from '@/lib/admin-api';
import { type CourierParcel } from '@/lib/parcels-api';
import { Loader2, Mail, Send } from 'lucide-react';

function toast(message: string) {
  window.alert(message);
}

export default function MailDesk() {
  const searchParams = useSearchParams();
  const parcelQuery = searchParams.get('parcel') || '';
  const [parcels, setParcels] = useState<CourierParcel[]>([]);
  const [parcelId, setParcelId] = useState(parcelQuery);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [settingsBusy, setSettingsBusy] = useState(false);
  const [siteUrl, setSiteUrl] = useState('http://localhost:3001');
  const [allowedOriginsText, setAllowedOriginsText] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpReplyTo, setSmtpReplyTo] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpPassConfigured, setSmtpPassConfigured] = useState(false);

  useEffect(() => {
    parcelsAdminApi.list().then((res) => setParcels(res.parcels || [])).catch(() => setParcels([]));
    parcelsAdminApi
      .getSettings()
      .then((res) => {
        setSiteUrl(res.siteUrl || 'http://localhost:3001');
        setAllowedOriginsText((res.allowedOrigins || []).join('\n'));
        setAdminEmail(res.adminEmail || '');
        setSmtpHost(res.smtp?.host || '');
        setSmtpPort(String(res.smtp?.port || 587));
        setSmtpUser(res.smtp?.user || '');
        setSmtpFrom(res.smtp?.from || '');
        setSmtpReplyTo(res.smtp?.replyTo || '');
        setSmtpSecure(!!res.smtp?.secure);
        setSmtpPassConfigured(!!res.smtp?.passConfigured);
      })
      .catch(() => undefined);
  }, []);

  const selected = useMemo(
    () => parcels.find((parcel) => parcel.id === parcelId) || null,
    [parcels, parcelId],
  );

  useEffect(() => {
    if (!selected) return;
    const email = selected.receiver?.email || selected.sender?.email || '';
    if (email && !to) setTo(email);
    if (!subject) setSubject(`Update on shipment ${selected.trackingCode}`);
  }, [selected, to, subject]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await parcelsAdminApi.sendMail({
        to: to.trim(),
        subject: subject.trim(),
        message: message.trim(),
        parcelId: parcelId || undefined,
      });
      toast(res.message || 'Mail sent');
      setMessage('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not send mail');
    }
    setBusy(false);
  };

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSettingsBusy(true);
    try {
      const res = await parcelsAdminApi.updateSettings({
        siteUrl,
        allowedOrigins: allowedOriginsText.split('\n').map((row) => row.trim()).filter(Boolean),
        adminEmail,
        smtpHost,
        smtpPort: Number(smtpPort) || 587,
        smtpUser,
        smtpPass: smtpPass || undefined,
        smtpFrom,
        smtpReplyTo,
        smtpSecure,
      });
      setSmtpPass('');
      setSmtpPassConfigured(!!res.smtp?.passConfigured);
      toast(res.message || 'Mail settings saved');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save mail settings');
    }
    setSettingsBusy(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
          <Mail className="w-7 h-7 text-zinc-600" />
          Send mail
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Email a sender or receiver about a shipment, and keep VeloRoute SMTP settings here.
        </p>
      </div>

      <form onSubmit={send} className="vr-admin-card p-5 space-y-4">
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Link a parcel (optional)</span>
          <select value={parcelId} onChange={(e) => setParcelId(e.target.value)} className="vr-admin-input w-full">
            <option value="">No parcel</option>
            {parcels.map((parcel) => (
              <option key={parcel.id} value={parcel.id}>
                {parcel.trackingCode} — {parcel.originLabel} → {parcel.destLabel}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">To</span>
          <input required type="email" value={to} onChange={(e) => setTo(e.target.value)} className="vr-admin-input w-full" placeholder="customer@email.com" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Subject</span>
          <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="vr-admin-input w-full" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Message</span>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="vr-admin-input w-full min-h-[10rem]" placeholder="Write the update…" />
        </label>
        <button type="submit" disabled={busy} className="vr-admin-btn vr-admin-btn--primary inline-flex items-center gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {busy ? 'Sending…' : 'Send email'}
        </button>
      </form>

      <form onSubmit={saveSettings} className="vr-admin-card p-5 space-y-4">
        <h2 className="text-sm font-bold">SMTP and tracking domain</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Public tracking site URL</span>
            <input required value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="vr-admin-input w-full" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Extra allowed origins</span>
            <textarea rows={3} value={allowedOriginsText} onChange={(e) => setAllowedOriginsText(e.target.value)} className="vr-admin-input w-full min-h-[4.5rem]" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Admin notification email</span>
            <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="vr-admin-input w-full" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">SMTP host</span>
            <input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="vr-admin-input w-full" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Port</span>
            <input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="vr-admin-input w-full" />
          </label>
          <label className="flex items-center gap-2 pt-6">
            <input type="checkbox" checked={smtpSecure} onChange={(e) => setSmtpSecure(e.target.checked)} />
            <span className="text-xs text-zinc-500">SSL/TLS (465)</span>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Username</span>
            <input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="vr-admin-input w-full" autoComplete="off" />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Password</span>
            <input
              type="password"
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
              className="vr-admin-input w-full"
              placeholder={smtpPassConfigured ? '•••••••• (leave blank to keep)' : 'App password'}
              autoComplete="new-password"
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">From address</span>
            <input value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} className="vr-admin-input w-full" />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Reply-to</span>
            <input value={smtpReplyTo} onChange={(e) => setSmtpReplyTo(e.target.value)} className="vr-admin-input w-full" />
          </label>
        </div>
        <button type="submit" disabled={settingsBusy} className="vr-admin-btn vr-admin-btn--primary">
          {settingsBusy ? 'Saving…' : 'Save mail settings'}
        </button>
      </form>
    </div>
  );
}
