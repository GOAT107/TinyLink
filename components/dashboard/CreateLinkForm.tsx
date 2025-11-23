'use client';

import { FormEvent, useState } from 'react';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import { isValidCode, isValidUrl, normalizeUrl } from '@/lib/validation';

type CreateLinkFormProps = {
  onCreated: () => Promise<void> | void;
};

type FieldErrors = {
  url?: string;
  code?: string;
  generic?: string;
};

export default function CreateLinkForm({ onCreated }: CreateLinkFormProps) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const nextErrors: FieldErrors = {};
    const trimmedUrl = url.trim();
    const trimmedCode = code.trim();

    if (!trimmedUrl) {
      nextErrors.url = 'URL is required.';
    } else if (!isValidUrl(trimmedUrl)) {
      nextErrors.url = 'Enter a valid URL starting with http:// or https://.';
    }

    if (trimmedCode && !isValidCode(trimmedCode)) {
      nextErrors.code = 'Use 6–8 letters and numbers only.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: normalizeUrl(trimmedUrl),
          code: trimmedCode || undefined,
        }),
      });

      const body = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        if (res.status === 409) {
          setErrors({
            code: body?.error || 'Code already exists.',
          });
        } else if (res.status === 400) {
          setErrors({
            generic: body?.error || 'Validation failed.',
          });
        } else {
          setErrors({
            generic: body?.error || 'Failed to create link.',
          });
        }
        return;
      }

      setUrl('');
      setCode('');
      setSuccessMessage('Link created successfully.');
      await onCreated();
    } catch (err) {
      setErrors({
        generic:
          (err as Error).message || 'Unexpected error while creating link.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-slate-50/80 p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-slate-800">
        Create a new short link
      </h2>
      <p className="mb-4 text-xs text-slate-600">
        Provide a long URL and optionally a custom code. Codes must be
        alphanumeric, 6–8 characters, and globally unique.
      </p>

      {(errors.generic || successMessage) && (
        <div className="mb-3 space-y-2">
          {errors.generic && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errors.generic}
            </div>
          )}
          {successMessage && !errors.generic && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {successMessage}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Input
            label="Long URL"
            placeholder="https://example.com/docs"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={errors.url}
          />
          <Input
            label="Custom code (optional)"
            placeholder="mydocs"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={errors.code}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create link'}
          </Button>
        </div>
      </form>
    </div>
  );
}