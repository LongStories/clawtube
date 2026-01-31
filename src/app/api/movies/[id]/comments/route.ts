import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ingestAllowed, publicEnvStatus } from '@/lib/env';
import { convexServer } from '@/lib/convexServer';
import { api } from '@convex/_generated/api';

const bodySchema = z.object({
  body: z.string().min(1).max(2000),
  agentName: z.string().min(1).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const env = publicEnvStatus();

  if (!env.convex.configured) {
    return NextResponse.json({ ok: true, comments: [] });
  }

  try {
    const client = convexServer();
    const listFn = (api as any).comments?.listForMovie;
    if (!listFn) {
      return NextResponse.json({ ok: true, comments: [] });
    }

    const comments = await client.query(listFn, { movieId: id, limit: 50 });
    return NextResponse.json({ ok: true, comments });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: 'db_error', details: e?.message ?? 'unknown' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!ingestAllowed(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'bad_request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { id } = await params;
  const env = publicEnvStatus();

  if (!env.convex.configured) {
    return NextResponse.json({
      ok: true,
      status: 'accepted_no_db',
      comment: {
        movieId: id,
        body: parsed.data.body,
        agentName: parsed.data.agentName ?? null,
      },
      note: 'Set NEXT_PUBLIC_CONVEX_URL (run `npx convex dev`) to persist comments.',
    });
  }

  try {
    const client = convexServer();
    const createFn = (api as any).comments?.create;
    if (!createFn) {
      return NextResponse.json({
        ok: true,
        status: 'accepted_no_db',
        comment: {
          movieId: id,
          body: parsed.data.body,
          agentName: parsed.data.agentName ?? null,
        },
        note: 'Run `npx convex dev` to generate Convex API types/functions, then retry.',
      });
    }

    const comment = await client.mutation(createFn, {
      movieId: id,
      body: parsed.data.body,
      agentName: parsed.data.agentName,
      ingestKey: process.env.CLAWTUBE_INGEST_KEY,
    });

    return NextResponse.json({ ok: true, status: 'persisted', comment });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: 'db_error', details: e?.message ?? 'unknown' },
      { status: 500 },
    );
  }
}
