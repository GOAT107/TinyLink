'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/common/button';
import Input from '@/components/common/input';
import LoadingSpinner from '@/components/common/loadingspinner';
import { formatLastClicked } from '@/lib/format';
import { getBaseUrl } from '@/lib/config';
import type { LinkDto } from '@/app/page';
import Link from 'next/link';

type LinksTableProps = {
  links: LinkDto[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onDelete: (code: string) => Promise<void>;
  onRefresh: () => Promise<void>;
};

export default function LinksTable({
  links,
  loading,
  refreshing,
  error,
  search,
  onSearchChange,
  onDelete,
  onRefresh,
}: LinksTableProps) {
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const baseUrl = getBaseUrl();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (link) =>
        link.code.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q),
    );
  }, [links, search]);

  async function handleDeleteClick(code: string) {
    setDeleteError(null);
    const confirmed = window.confirm(
      `Delete link "${code}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingCode(code);
      await onDelete(code);
    } catch (err) {
      setDeleteError(
        (err as Error).message || 'Failed to delete link. Please try again.',
      );
    } finally {
      setDeletingCode(null);
    }
  }

  const hasLinks = filtered.length > 0;

  return (
    <div className="rounded-xl border bg-slate-50/80 p-4 shadow-sm">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-800">Your links</h2>
          <p className="text-xs text-slate-600">
            Search by code or URL, copy short links, view stats, or delete.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-56">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRefresh()}
            disabled={loading || refreshing}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner label="Loading links…" />
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRefresh()}
              disabled={refreshing}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : !hasLinks ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-lg">🔗</span>
          </div>
          <p className="text-sm font-medium text-slate-800">No links yet</p>
          <p className="max-w-sm text-xs text-slate-600">
            Create your first TinyLink using the form above and it will appear
            here with stats.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="w-44 px-3 py-2">Short code</th>
                <th className="px-3 py-2">Target URL</th>
                <th className="w-20 px-3 py-2 text-right">Clicks</th>
                <th className="w-48 px-3 py-2">Last clicked</th>
                <th className="w-40 px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((link) => {
                const shortUrl = `${baseUrl.replace(/\/$/, '')}/${
                  link.code
                }`;

                return (
                  <tr
                    key={link.code}
                    className="align-middle transition-colors hover:bg-slate-50"
                  >
                    <td className="max-w-[11rem] px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          className="max-w-full truncate text-xs font-mono text-slate-900 underline-offset-2 hover:underline"
                          onClick={() =>
                            window.open(
                              shortUrl,
                              '_blank',
                              'noopener,noreferrer',
                            )
                          }
                          title={shortUrl}
                        >
                          {shortUrl}
                        </button>
                        <button
                          type="button"
                          className="w-fit text-[11px] text-slate-500 hover:text-slate-800"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(shortUrl);
                            } catch {
                              // ignore
                            }
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="max-w-xs px-3 py-2">
                      <span
                        className="block truncate text-xs text-slate-800"
                        title={link.url}
                      >
                        {link.url}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-xs tabular-nums text-slate-800">
                      {link.totalClicks}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {formatLastClicked(link.lastClickedAt)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/code/${encodeURIComponent(link.code)}`}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                        >
                          Stats
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => void handleDeleteClick(link.code)}
                          disabled={deletingCode === link.code}
                        >
                          {deletingCode === link.code ? 'Deleting…' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteError && !error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {deleteError}
        </div>
      )}
    </div>
  );
}