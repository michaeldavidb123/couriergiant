'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { parcelsAdminApi } from '@/lib/admin-api';
import { type CourierParcel, type CourierProgressMode } from '@/lib/parcels-api';
import {
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  Package,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  SkipBack,
  SkipForward,
  Trash2,
  User,
} from 'lucide-react';

function toast(message: string) {
  window.alert(message);
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

function trackingUrl(parcel: CourierParcel) {
  if (parcel.trackingUrl) return parcel.trackingUrl;
  return `/tracking?id=${encodeURIComponent(parcel.trackingCode)}`;
}

function currentStepIndex(events: Array<{ isCurrent: boolean }>) {
  const index = events.findIndex((event) => event.isCurrent);
  return index >= 0 ? index : 0;
}

function modeLabel(mode?: CourierProgressMode) {
  if (mode === 'auto') return 'Auto';
  if (mode === 'paused') return 'Paused';
  return 'Manual';
}

function userLabel(user?: CourierParcel['targetUser']) {
  if (!user) return '';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.companyName || user.username || user.email || '';
}

export default function ParcelsDesk() {
  const [parcels, setParcels] = useState<CourierParcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CourierParcel | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await parcelsAdminApi.list();
      setParcels(res.parcels || []);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load parcels');
      setParcels([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parcels;
    return parcels.filter((p) =>
      [
        p.trackingCode,
        p.referenceNo,
        p.courierName,
        p.shipperName,
        p.receiverName,
        p.sender?.name,
        p.receiver?.name,
        p.originLabel,
        p.destLabel,
        p.targetUser?.email,
        p.targetUser?.firstName,
        p.targetUser?.lastName,
        p.status,
        p.progressMode,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [parcels, query]);

  const runAction = async (
    parcel: CourierParcel,
    action: Parameters<typeof parcelsAdminApi.action>[1],
  ) => {
    setBusy(`${parcel.id}:${action}`);
    try {
      const res = await parcelsAdminApi.action(parcel.id, action);
      setBusy(null);
      if (res.parcel) {
        setParcels((prev) => prev.map((row) => (row.id === parcel.id ? res.parcel : row)));
      } else {
        load();
      }
    } catch (err) {
      setBusy(null);
      toast(err instanceof Error ? err.message : 'Could not update parcel');
    }
  };

  const resetDefaults = async () => {
    const ok = window.confirm(
      'Reset demo parcels? This replaces every parcel with the VeloRoute demo set, including EG123456789IN.',
    );
    if (!ok) return;
    setBusy('seed');
    try {
      const res = await parcelsAdminApi.seedDefaults();
      setBusy(null);
      toast(res.message || 'Demo parcels restored');
      load();
    } catch (err) {
      setBusy(null);
      toast(err instanceof Error ? err.message : 'Could not reset demo data');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(deleteTarget.id);
    try {
      const res = await parcelsAdminApi.remove(deleteTarget.id);
      setBusy(null);
      toast(res.message || 'Parcel deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      setBusy(null);
      toast(err instanceof Error ? err.message : 'Could not delete parcel');
    }
  };

  const liveCount = parcels.filter((p) => p.isActive).length;
  const pausedCount = parcels.filter((p) => p.progressMode === 'paused').length;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-zinc-600" />
            Parcels
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Pause, move, hold, or hide shipments. Create a parcel on its own page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/mail" className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send mail
          </Link>
          <Link href="/admin/documents" className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </Link>
          <button
            type="button"
            onClick={resetDefaults}
            disabled={busy === 'seed'}
            className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2"
          >
            {busy === 'seed' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Reset demo data
          </button>
          <Link href="/admin/parcels/new" className="vr-admin-btn vr-admin-btn--primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New parcel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="vr-admin-card p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Total</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{parcels.length}</div>
        </div>
        <div className="vr-admin-card p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Public</div>
          <div className="text-2xl font-bold text-zinc-600 mt-1">{liveCount}</div>
        </div>
        <div className="vr-admin-card p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Paused</div>
          <div className="text-2xl font-bold text-zinc-600 mt-1">{pausedCount}</div>
        </div>
        <div className="vr-admin-card p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-400 font-semibold">Hidden</div>
          <div className="text-2xl font-bold text-zinc-500 mt-1">{parcels.length - liveCount}</div>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="vr-admin-input w-full"
        placeholder="Search tracking code, shipper, receiver, city…"
      />

      {loading ? (
        <span className="vr-admin-spinner" />
      ) : filtered.length === 0 ? (
        <div className="vr-admin-card p-10 text-sm text-zinc-500">
          No parcels yet.{' '}
          <Link href="/admin/parcels/new" className="font-semibold text-zinc-800 underline">
            Create one
          </Link>{' '}
          or restore the demo set.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((parcel) => {
            const working = busy?.startsWith(parcel.id);
            const current = parcel.events.find((e) => e.isCurrent) || parcel.events.filter((e) => e.isCompleted).at(-1);
            const idx = currentStepIndex(parcel.events);
            const last = Math.max(0, parcel.events.length - 1);
            const paused = parcel.progressMode === 'paused';
            return (
              <article key={parcel.id} className="vr-admin-card p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-mono text-base font-bold text-zinc-900">{parcel.trackingCode}</h2>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {parcel.courierName || 'VeloRoute'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {statusLabel(parcel.status)}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          paused ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {modeLabel(parcel.progressMode)}
                      </span>
                      {!parcel.isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">
                      {parcel.originLabel} → {parcel.destLabel}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {parcel.sender?.name || parcel.shipperName} · {parcel.receiver?.name || parcel.receiverName}
                      {current ? ` · ${current.title} (${current.locationLabel})` : ''}
                    </p>
                    {parcel.targetUser ? (
                      <p className="text-xs text-zinc-600 inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Linked account: {userLabel(parcel.targetUser)} ({parcel.targetUser.email})
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={trackingUrl(parcel)}
                      target="_blank"
                      rel="noreferrer"
                      className="vr-admin-btn vr-admin-btn--ghost p-2"
                      aria-label="View on tracking site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link href={`/admin/parcels/${parcel.id}`} className="vr-admin-btn vr-admin-btn--ghost p-2" aria-label="Edit parcel">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(parcel)}
                      disabled={working}
                      className="vr-admin-btn vr-admin-btn--ghost p-2 text-red-600"
                      aria-label="Delete parcel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {paused ? (
                    <>
                      <button
                        type="button"
                        disabled={working}
                        onClick={() => runAction(parcel, 'resume')}
                        className="vr-admin-btn vr-admin-btn--primary text-xs inline-flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Resume
                      </button>
                      <button
                        type="button"
                        disabled={working}
                        onClick={() => runAction(parcel, 'resume_auto')}
                        className="vr-admin-btn vr-admin-btn--ghost text-xs"
                      >
                        Resume auto
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={working || parcel.status === 'delivered' || parcel.status === 'cancelled'}
                      onClick={() => runAction(parcel, 'pause')}
                      className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1.5"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={working || idx <= 0}
                    onClick={() => runAction(parcel, 'move_back')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1.5"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                    Move back
                  </button>
                  <button
                    type="button"
                    disabled={working || idx >= last}
                    onClick={() => runAction(parcel, 'move_forward')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1.5"
                  >
                    Move
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => runAction(parcel, 'hold')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs"
                  >
                    Hold
                  </button>
                  <button
                    type="button"
                    disabled={working || parcel.status === 'delivered'}
                    onClick={() => runAction(parcel, 'deliver')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs"
                  >
                    Mark delivered
                  </button>
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => runAction(parcel, parcel.isActive ? 'hide' : 'show')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs"
                  >
                    {parcel.isActive ? 'Hide tracking' : 'Show tracking'}
                  </button>
                  <button
                    type="button"
                    disabled={working || parcel.status === 'cancelled'}
                    onClick={() => runAction(parcel, 'cancel')}
                    className="vr-admin-btn vr-admin-btn--ghost text-xs text-red-600"
                  >
                    Cancel
                  </button>
                  <Link href={`/admin/mail?parcel=${parcel.id}`} className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </Link>
                  <Link href={`/admin/documents?parcel=${parcel.id}`} className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Files
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="vr-admin-modal w-full max-w-md p-5 space-y-4">
            <h3 className="text-lg font-bold">Delete parcel?</h3>
            <p className="text-sm text-zinc-500">
              Remove <strong>{deleteTarget.trackingCode}</strong> and all journey landmarks? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="vr-admin-btn vr-admin-btn--ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={busy === deleteTarget.id}
                className="vr-admin-btn vr-admin-btn--danger"
              >
                {busy === deleteTarget.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
