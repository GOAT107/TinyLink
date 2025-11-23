import type { LinkDto } from '@/app/page';
import { formatDateTime, formatLastClicked } from '@/lib/format';
import { getBaseUrl } from '@/lib/config';

type LinkStatsCardProps = {
  link: LinkDto;
};

export default function LinkStatsCard({ link }: LinkStatsCardProps) {
  const baseUrl = getBaseUrl();
  const shortUrl = `${baseUrl.replace(/\/$/, '')}/${link.code}`;

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          Stats for <span className="font-mono text-slate-900">{link.code}</span>
        </h1>
        <p className="text-xs text-slate-600">
          Use this page to inspect a single TinyLink.
        </p>
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-xs font-medium text-slate-500">Short URL</p>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="max-w-full truncate font-mono text-sm text-slate-900"
            title={shortUrl}
          >
            {shortUrl}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-xs font-medium text-slate-500">Target URL</p>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="block max-w-full truncate text-sm text-slate-800 underline-offset-2 hover:underline"
          title={link.url}
        >
          {link.url}
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Total clicks
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {link.totalClicks}
          </p>
        </div>
        <div className="rounded-md border bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Last clicked
          </p>
          <p className="mt-1 text-sm text-slate-800">
            {formatLastClicked(link.lastClickedAt)}
          </p>
        </div>
        <div className="rounded-md border bg-slate-50 px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Created at
          </p>
          <p className="mt-1 text-sm text-slate-800">
            {formatDateTime(link.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}