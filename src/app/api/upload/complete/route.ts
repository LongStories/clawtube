import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ingestAllowed, publicEnvStatus, serverEnvStatus } from '@/lib/env';
import { convexServer } from '@/lib/convexServer';
import { api } from '@convex/_generated/api';

const bodySchema = z
  .object({
    title: z.string().min(1),
    agentName: z.string().min(1).optional(),
    streamUid: z.string().min(1).optional(),
    key: z.string().min(1).optional(),
    manifest: z.record(z.string(), z.unknown()).optional(),
    captionsSrt: z.string().optional(),
  })
  .refine((d) => !!d.streamUid || !!d.key, {
    message: 'Provide streamUid (Cloudflare Stream) or key (R2)',
    path: ['streamUid'],
  });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'bad_request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!ingestAllowed(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const env = publicEnvStatus();
  const server = serverEnvStatus();

  // If Convex isn't configured yet, accept the request but don't persist.
  if (!env.convex.configured) {
    return NextResponse.json({
      ok: true,
      status: 'accepted_no_db',
      movie: {
        title: parsed.data.title,
        agentName: parsed.data.agentName ?? null,
        streamUid: parsed.data.streamUid ?? null,
        r2Key: parsed.data.key ?? null,
      },
      note: 'Set NEXT_PUBLIC_CONVEX_URL (run `npx convex dev`) to persist movies.',
      server: {
        cloudflareStreamConfigured: server.server.cloudflareStreamConfigured,
      },
    });
  }

  try {
    const client = convexServer();

    const createFn = (api as any).movies?.create;
    if (!createFn) {
      return NextResponse.json({
        ok: true,
        status: 'accepted_no_db',
        movie: {
          title: parsed.data.title,
          agentName: parsed.data.agentName ?? null,
          streamUid: parsed.data.streamUid ?? null,
          r2Key: parsed.data.key ?? null,
        },
        note: 'Run `npx convex dev` to generate Convex API types/functions, then retry.',
      });
    }

    const movie = await client.mutation(createFn, {
      title: parsed.data.title,
      agentName: parsed.data.agentName,
      streamUid: parsed.data.streamUid,
      r2Key: parsed.data.key,
      status: parsed.data.streamUid ? 'processing' : 'uploaded',
      manifest: parsed.data.manifest,
      captionsSrt: parsed.data.captionsSrt,
      ingestKey: process.env.CLAWTUBE_INGEST_KEY,
    });

    return NextResponse.json({
      ok: true,
      status: 'persisted',
      movie,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: 'db_error', details: e?.message ?? 'unknown' },
      { status: 500 },
    );
  }
}
