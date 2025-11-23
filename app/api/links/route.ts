import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRandomCode } from '@/lib/codegen';
import { isValidCode, isValidUrl, normalizeUrl } from '@/lib/validation';

type CreateLinkRequestBody = {
  url?: string;
  code?: string;
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

// GET /api/links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      links: links.map(mapLinkToApi),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list links' },
      { status: 500 },
    );
  }
}

// POST /api/links
export async function POST(request: Request) {
  let body: CreateLinkRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const rawUrl = body.url?.trim() ?? '';
  const rawCode = body.code?.trim() ?? '';

  if (!rawUrl) {
    return NextResponse.json(
      { error: 'URL is required' },
      { status: 400 },
    );
  }

  if (!isValidUrl(rawUrl)) {
    return NextResponse.json(
      { error: 'Invalid URL. Must start with http:// or https:// and be well-formed.' },
      { status: 400 },
    );
  }

  const targetUrl = normalizeUrl(rawUrl);

  let code = rawCode;

  if (code) {
    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: 'Invalid code format. Use 6–8 alphanumeric characters.' },
        { status: 400 },
      );
    }
  } else {
    
    code = generateRandomCode(6);
  }

  try {
    const created = await prisma.link.create({
      data: {
        code,
        targetUrl,
      },
    });

    return NextResponse.json(mapLinkToApi(created), { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation for code.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Code already exists. Please choose another one.' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 },
    );
  }
}