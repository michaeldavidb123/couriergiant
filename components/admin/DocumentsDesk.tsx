'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { parcelsAdminApi } from '@/lib/admin-api';
import { mediaUrl, type CourierParcel } from '@/lib/parcels-api';
import { FileText, Loader2, Plus, Upload } from 'lucide-react';

const DOC_KINDS = [
  'Air Waybill',
  'Commercial invoice',
  'Packing list',
  'Proof of delivery',
  'Customs',
  'Insurance',
  'Shipping label',
  'Other',
];

function toast(message: string) {
  window.alert(message);
}

export default function DocumentsDesk() {
  const searchParams = useSearchParams();
  const [parcels, setParcels] = useState<CourierParcel[]>([]);
  const [parcelId, setParcelId] = useState(searchParams.get('parcel') || '');
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('Other');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await parcelsAdminApi.list();
      setParcels(res.parcels || []);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not load parcels');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = useMemo(
    () => parcels.find((parcel) => parcel.id === parcelId) || null,
    [parcels, parcelId],
  );

  const replaceParcel = (parcel: CourierParcel) => {
    setParcels((prev) => prev.map((row) => (row.id === parcel.id ? parcel : row)));
  };

  const createDoc = async (e: FormEvent) => {
    e.preventDefault();
    if (!parcelId) {
      toast('Choose a parcel first');
      return;
    }
    setBusy(true);
    try {
      const res = await parcelsAdminApi.createDocument({
        parcelId,
        title: title.trim() || 'Document',
        kind,
        content: content.trim() || undefined,
        url: url.trim() || undefined,
      });
      if (res.parcel) replaceParcel(res.parcel);
      toast(res.message || 'Document attached');
      setTitle('');
      setContent('');
      setUrl('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not create document');
    }
    setBusy(false);
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!parcelId) {
      toast('Choose a parcel first');
      return;
    }
    setUploadBusy(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await parcelsAdminApi.uploadFile(file);
        const res = await parcelsAdminApi.createDocument({
          parcelId,
          title: title.trim() || uploaded.title || file.name,
          kind,
          url: uploaded.url,
        });
        if (res.parcel) replaceParcel(res.parcel);
      }
      toast('File uploaded');
      setTitle('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload file');
    }
    setUploadBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-zinc-600" />
          Documents
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Upload a file or write a document, then attach it to a parcel for public tracking download.
        </p>
      </div>

      <label className="vr-admin-card p-5 block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Parcel</span>
        <select value={parcelId} onChange={(e) => setParcelId(e.target.value)} className="vr-admin-input w-full">
          <option value="">Choose a parcel</option>
          {parcels.map((parcel) => (
            <option key={parcel.id} value={parcel.id}>
              {parcel.trackingCode} — {parcel.originLabel} → {parcel.destLabel}
            </option>
          ))}
        </select>
      </label>

      <div className="grid lg:grid-cols-2 gap-4">
        <form onSubmit={createDoc} className="vr-admin-card p-5 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create document
          </h2>
          <label className="space-y-1.5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="vr-admin-input w-full" placeholder="Air waybill" />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Kind</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="vr-admin-input w-full">
              {DOC_KINDS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Write content</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="vr-admin-input w-full min-h-[8rem]" placeholder="Optional. Saved as a downloadable text file." />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Or paste a file URL</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="vr-admin-input w-full" placeholder="https://…" />
          </label>
          <button type="submit" disabled={busy} className="vr-admin-btn vr-admin-btn--primary">
            {busy ? 'Saving…' : 'Create and attach'}
          </button>
        </form>

        <div className="vr-admin-card p-5 space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload file
          </h2>
          <p className="text-xs text-zinc-500">Any document type except executables. Max 25MB.</p>
          <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
          <button
            type="button"
            disabled={uploadBusy}
            onClick={() => fileRef.current?.click()}
            className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-2"
          >
            {uploadBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadBusy ? 'Uploading…' : 'Choose files'}
          </button>
        </div>
      </div>

      <div className="vr-admin-card p-5 space-y-3">
        <h2 className="text-sm font-bold">Attached files</h2>
        {!selected ? (
          <p className="text-sm text-zinc-400">Choose a parcel to see its documents.</p>
        ) : !selected.documents?.length ? (
          <p className="text-sm text-zinc-400">No documents on {selected.trackingCode} yet.</p>
        ) : (
          <ul className="space-y-2">
            {selected.documents.map((doc, index) => (
              <li key={`${doc.url}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{doc.title}</p>
                  <p className="text-[11px] text-zinc-400">{doc.kind || 'Other'}</p>
                </div>
                <a href={mediaUrl(doc.url)} target="_blank" rel="noreferrer" className="vr-admin-btn vr-admin-btn--ghost text-xs">
                  Open
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
