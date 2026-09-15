'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Loader2,
  Mail,
  RefreshCw,
  Reply,
} from 'lucide-react';
import {
  isCourierGiantInbound,
  mailAddresses,
  parcelsAdminApi,
  type InboundMailMessage,
  type OutboundMailMessage,
} from '@/lib/admin-api';

type MailTab = 'inbox' | 'sent';
type InboxFilter = 'all' | 'unread';

function formatWhen(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function replyAddress(from?: string | null) {
  const raw = (from || '').trim();
  const angled = raw.match(/<([^>]+)>/);
  return (angled?.[1] || raw).trim();
}

function replySubject(subject?: string | null) {
  const value = (subject || '').trim() || '(no subject)';
  return /^re:/i.test(value) ? value : `Re: ${value}`;
}

function displayAddresses(value: unknown, fallback?: string | null) {
  const addresses = mailAddresses(value);
  if (addresses.length) return addresses.join(', ');
  return (fallback || '').trim() || '—';
}

function MailBody({ text, html }: { text?: string | null; html?: string | null }) {
  const plain = (text || '').trim();
  if (plain) {
    return <pre className="whitespace-pre-wrap break-words text-sm text-zinc-800 font-sans">{plain}</pre>;
  }
  const markup = (html || '').trim();
  if (!markup) return <p className="text-sm text-zinc-500">No message body.</p>;
  return (
    <iframe
      title="Email body"
      sandbox=""
      referrerPolicy="no-referrer"
      className="w-full min-h-[24rem] rounded-lg border border-zinc-200 bg-white"
      srcDoc={markup}
    />
  );
}

function mergeInbound(
  base: InboundMailMessage | null | undefined,
  patch: Partial<InboundMailMessage> | null | undefined,
  id: string,
): InboundMailMessage {
  return { ...(base || { id }), ...patch, id };
}

export default function MailInboxDesk() {
  const [tab, setTab] = useState<MailTab>('inbox');
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [inbound, setInbound] = useState<InboundMailMessage[]>([]);
  const [outbound, setOutbound] = useState<OutboundMailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedInboundId, setSelectedInboundId] = useState<string | null>(null);
  const [selectedOutboundId, setSelectedOutboundId] = useState<string | null>(null);
  const [selectedInbound, setSelectedInbound] = useState<InboundMailMessage | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async (opts: { silent?: boolean } = {}) => {
    if (opts.silent) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [inboundRes, outboundRes] = await Promise.all([
        parcelsAdminApi.listInboundMail({
          limit: 80,
          unread: filter === 'unread',
        }),
        parcelsAdminApi.listOutboundMail({ limit: 80, channel: 'courier' }).catch(() => ({ messages: [] as OutboundMailMessage[] })),
      ]);
      setInbound((inboundRes.messages || []).filter(isCourierGiantInbound).filter((row) => (filter === 'unread' ? !row.readAt : true)));
      setOutbound(outboundRes.messages || []);
    } catch (err) {
      setInbound([]);
      setOutbound([]);
      setError(err instanceof Error ? err.message : 'Could not load mail');
    }
    setLoading(false);
    setRefreshing(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(() => inbound.filter((row) => !row.readAt).length, [inbound]);
  const selectedOutbound = useMemo(
    () => outbound.find((row) => row.id === selectedOutboundId) || null,
    [outbound, selectedOutboundId],
  );

  const openInbound = async (id: string) => {
    const preview = inbound.find((row) => row.id === id) || null;
    setSelectedInboundId(id);
    setSelectedOutboundId(null);
    setSelectedInbound(preview);
    setDetailLoading(true);
    try {
      if (preview && !preview.readAt) {
        try {
          const marked = await parcelsAdminApi.markInboundMailRead(id);
          const readAt = marked.message?.readAt || new Date().toISOString();
          setInbound((prev) => prev.map((row) => (row.id === id ? mergeInbound(row, { ...marked.message, readAt }, id) : row)));
          setSelectedInbound((prev) => (prev?.id === id ? mergeInbound(prev, { ...marked.message, readAt }, id) : prev));
        } catch {
          // Still open the message if mark-read is denied.
        }
      }
      const res = await parcelsAdminApi.getInboundMail(id);
      if (res.message) {
        setSelectedInbound((prev) => mergeInbound(prev, res.message, id));
        setInbound((prev) => prev.map((row) => (row.id === id ? mergeInbound(row, res.message, id) : row)));
      }
    } catch (err) {
      if (!preview) {
        setError(err instanceof Error ? err.message : 'Could not open message');
      }
    }
    setDetailLoading(false);
  };

  const replyHref = selectedInbound
    ? `/admin/mail?to=${encodeURIComponent(replyAddress(selectedInbound.fromAddress))}&subject=${encodeURIComponent(replySubject(selectedInbound.subject))}`
    : '/admin/mail';

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
            <Inbox className="w-7 h-7 text-zinc-600" />
            Inbox
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Inbound mail for *@couriergiant.com. Compose outbound from Send mail.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/mail" className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send mail
          </Link>
          <button
            type="button"
            onClick={() => load({ silent: true })}
            disabled={loading || refreshing}
            className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2"
          >
            {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={`vr-admin-btn text-xs ${tab === 'inbox' ? 'vr-admin-btn--primary' : 'vr-admin-btn--ghost'}`}
            onClick={() => setTab('inbox')}
          >
            Inbox{unreadCount ? ` (${unreadCount})` : ''}
          </button>
          <button
            type="button"
            className={`vr-admin-btn text-xs ${tab === 'sent' ? 'vr-admin-btn--primary' : 'vr-admin-btn--ghost'}`}
            onClick={() => setTab('sent')}
          >
            Sent
          </button>
        </div>
        {tab === 'inbox' ? (
          <div className="flex gap-1">
            <button
              type="button"
              className={`vr-admin-btn text-xs ${filter === 'all' ? 'vr-admin-btn--primary' : 'vr-admin-btn--ghost'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`vr-admin-btn text-xs ${filter === 'unread' ? 'vr-admin-btn--primary' : 'vr-admin-btn--ghost'}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="vr-admin-card p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="vr-admin-card vr-admin-mail">
        <div className="vr-admin-mail__list">
          {loading ? (
            <div className="p-8">
              <span className="vr-admin-spinner" />
              <p className="text-center text-sm text-zinc-500 mt-3">Loading mail…</p>
            </div>
          ) : tab === 'inbox' ? (
            inbound.length === 0 ? (
              <p className="p-8 text-sm text-zinc-500">No inbound mail for *@couriergiant.com yet.</p>
            ) : (
              inbound.map((message) => {
                const unread = !message.readAt;
                const active = message.id === selectedInboundId;
                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => openInbound(message.id)}
                    className={`vr-admin-mail__row${active ? ' is-active' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${unread ? 'bg-teal-600' : 'bg-transparent'}`}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${unread ? 'font-bold text-zinc-900' : 'font-medium text-zinc-700'}`}>
                          {message.subject || '(no subject)'}
                        </p>
                        <p className="truncate text-xs text-zinc-500">{message.fromAddress || 'Unknown sender'}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{formatWhen(message.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )
          ) : outbound.length === 0 ? (
            <p className="p-8 text-sm text-zinc-500">No outbound CourierGiant mail yet.</p>
          ) : (
            outbound.map((message) => {
              const active = message.id === selectedOutboundId;
              return (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => {
                    setSelectedOutboundId(message.id);
                    setSelectedInboundId(null);
                    setSelectedInbound(null);
                  }}
                  className={`vr-admin-mail__row${active ? ' is-active' : ''}`}
                >
                  <p className="truncate text-sm font-medium text-zinc-800">{message.subject || '(no subject)'}</p>
                  <p className="truncate text-xs text-zinc-500">
                    To {displayAddresses(message.toAddresses, message.toAddress)}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{formatWhen(message.createdAt)}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="p-5 min-h-[20rem]">
          {tab === 'inbox' ? (
            !selectedInbound ? (
              <p className="text-sm text-zinc-500">Select a message to read it.</p>
            ) : (
              <article className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-lg font-bold text-zinc-900">{selectedInbound.subject || '(no subject)'}</h2>
                    <p className="text-sm text-zinc-600">
                      <span className="font-semibold text-zinc-500">From</span> {selectedInbound.fromAddress || '—'}
                    </p>
                    <p className="text-sm text-zinc-600">
                      <span className="font-semibold text-zinc-500">To</span> {displayAddresses(selectedInbound.toAddresses)}
                    </p>
                    <p className="text-xs text-zinc-400">{formatWhen(selectedInbound.createdAt)}</p>
                  </div>
                  <Link href={replyHref} className="vr-admin-btn vr-admin-btn--primary inline-flex items-center gap-2">
                    <Reply className="w-4 h-4" />
                    Reply
                  </Link>
                </div>
                {detailLoading ? (
                  <p className="text-sm text-zinc-500 inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading message…
                  </p>
                ) : (
                  <MailBody text={selectedInbound.textBody} html={selectedInbound.htmlBody} />
                )}
              </article>
            )
          ) : !selectedOutbound ? (
            <p className="text-sm text-zinc-500">Select a sent message to view it.</p>
          ) : (
            <article className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-zinc-900">{selectedOutbound.subject || '(no subject)'}</h2>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-500">From</span> {selectedOutbound.fromAddress || '—'}
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-500">To</span>{' '}
                  {displayAddresses(selectedOutbound.toAddresses, selectedOutbound.toAddress)}
                </p>
                <p className="text-xs text-zinc-400">{formatWhen(selectedOutbound.createdAt)}</p>
              </div>
              <MailBody text={selectedOutbound.textBody} html={selectedOutbound.htmlBody} />
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
