import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    code: string;
  };
};

function mapLinkToApi(link: {
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: Date | null;
  createdAt: Date;
}) {
  return {
    code: link.code,
    url: link.targetUrl,
    totalClicks: link.totalClicks,
    lastClickedAt: link.lastClickedAt,
    createdAt: link.createdAt,
  };
}

// GET /api/links/:code
export async function GET(_request: Request, { params }: RouteParams) {
  const code = params.code;

  try {
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(mapLinkToApi(link));
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 },
    );
  }
}

// DELETE /api/links/:code
export async function DELETE(_request: Request, { params }: RouteParams) {
  const code = params.code;

  try {
    const existing = await prisma.link.findUnique({
      where: { code },
      select: { code: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 },
      );
    }

    await prisma.link.delete({
      where: { code },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 },
    );
  }
}