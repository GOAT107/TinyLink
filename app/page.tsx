'use client';

import { useEffect, useState } from 'react';
import CreateLinkForm from '@/components/dashboard/CreateLinkForm';
import LinksTable from '@/components/dashboard/linkstable';

export type LinkDto = {
  code: string;
  url: string;
  totalClicks: number;
  lastClickedAt: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function fetchLinks() {
    try {
      setError(null);
      if (!loading) setRefreshing(true);

      const res = await fetch('/api/links', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch links');
      }

      const data = (await res.json()) as { links: LinkDto[] };
      setLinks(data.links ?? []);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch links');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // Initial load
    void fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreated() {
    await fetchLinks();
  }

  async function handleDelete(code: string) {
    const res = await fetch(`/api/links/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      throw new Error(body?.error || 'Failed to delete link');
    }

    setLinks((prev) => prev.filter((l) => l.code !== code));
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Create, manage, and inspect your TinyLinks.
        </p>
      </section>

      <section>
        <CreateLinkForm onCreated={handleCreated} />
      </section>

      <section>
        <LinksTable
          links={links}
          loading={loading}
          refreshing={refreshing}
          error={error}
          search={search}
          onSearchChange={setSearch}
          onDelete={handleDelete}
          onRefresh={fetchLinks}
        />
      </section>
    </div>
  );
}