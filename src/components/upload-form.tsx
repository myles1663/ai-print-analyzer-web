'use client';

import { FormEvent, useState } from 'react';

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select an image before submitting.');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setMessage(null);

    const fileExtension = file.name.split('.').pop() ?? 'jpg';
    const contentType = file.type || 'image/jpeg';

    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extension: fileExtension, contentType }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Failed to create upload URL');
      }

      const { uploadUrl, path } = await response.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Unable to upload file to storage.');
      }

      setStatus('success');
      setMessage(`Upload complete. Stored at ${path}`);
      setFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      setStatus('error');
      setMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
      <div>
        <label className="block text-sm font-medium text-slate-200" htmlFor="file">
          Print photo (JPG/PNG)
        </label>
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-100"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'uploading'}
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'uploading' ? 'Uploading…' : 'Upload photo'}
      </button>

      {message && (
        <p
          className={`text-sm ${
            status === 'success' ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
