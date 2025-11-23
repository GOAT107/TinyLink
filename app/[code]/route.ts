import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    code: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
  const code = params.code;

  const reserved = new Set(['api', 'healthz', 'code', '_next']);
  if (reserved.has(code)) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 },
    );
  }

  try {
    const updated = await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    
    return NextResponse.redirect(updated.targetUrl, 302);
  } catch (error: unknown) {
    // update() throws if record not found.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 },
    );
  }
}