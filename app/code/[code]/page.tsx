'use client';

import { useEffect, useState } from 'react';
import type { LinkDto } from '@/app/page';
import LoadingSpinner from '@/components/common/loadingspinner';
import Button from '@/components/common/button';
import Link from 'next/link';
import LinkStatsCard from '@/components/stats/linkstatscard';

type PageProps = {
  params: {
    code: string;
  };
};

export default function CodeStatsPage({ params }: PageProps) {
  const { code } = params;
  const [link, setLink] = useState<LinkDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch(`/api/links/${encodeURIComponent(code)}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (res.status === 404) {
          setError('Link not found.');
          setLink(null);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load link stats.');
        }

        const data = (await res.json()) as LinkDto;
        setLink(data);
      } catch (err) {
        setError(
          (err as Error).message || 'Unexpected error while loading stats.',
        );
        setLink(null);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [code]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Link stats</h1>
          <p className="text-sm text-slate-600">
            Details for <span className="font-mono">{code}</span>
          </p>
        </div>
        <Link href="/">
          <Button variant="secondary" size="sm">
            Back to dashboard
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner label="Loading stats…" />
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        </div>
      ) : link ? (
        <LinkStatsCard link={link} />
      ) : (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          No data available.
        </div>
      )}
    </div>
  );
}