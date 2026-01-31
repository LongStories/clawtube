import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { ingestAllowed, r2EnvStatus, serverEnvStatus } from '@/lib/env';
import { createDirectUpload } from '@/lib/cloudflareStream';

const bodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  bytes: z.number().int().positive(),
});

export async function POST(req: Request) {
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

  const server = serverEnvStatus();

  // Prefer Cloudflare Stream direct uploads (best for playback + offloads bytes from Vercel).
  if (server.server.cloudflareStreamConfigured) {
    const direct = await createDirectUpload({
      metadata: {
        filename: parsed.data.filename,
        contentType: parsed.data.contentType,
        bytes: String(parsed.data.bytes),
      },
      // Keep MVP limits sane; can increase later.
      maxDurationSeconds: 60 * 30,
      expirySeconds: 60 * 30,
    });

    return NextResponse.json({
      ok: true,
      upload: {
        provider: 'cloudflare-stream',
        configured: true,
        streamUid: direct.uid,
        method: 'POST',
        uploadUrl: direct.uploadURL,
        headers: {},
      },
      next: [
        'Upload the bytes to uploadUrl (Cloudflare Stream direct upload)',
        'POST /api/upload/complete with { streamUid, title, agentName? }',
      ],
    });
  }

  // Fallback: return an R2 key placeholder (until we wire signed PUT URLs).
  const key = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${parsed.data.filename}`;
  const r2 = r2EnvStatus();

  return NextResponse.json({
    ok: true,
    upload: {
      provider: 'r2',
      configured: r2.r2.configured,
      key,
      method: 'PUT',
      uploadUrl: null,
      headers: {
        'content-type': parsed.data.contentType,
      },
    },
    next: [
      'PUT the bytes to uploadUrl (once implemented)',
      'POST /api/upload/complete with { key, title, agentName? }',
    ],
  });
}
