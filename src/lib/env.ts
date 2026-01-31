import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
});

type PublicEnv = z.infer<typeof publicSchema>;

export function requirePublicEnv(): PublicEnv {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Missing/invalid public env (Convex). Set NEXT_PUBLIC_CONVEX_URL.\n${parsed.error.message}`,
    );
  }

  return parsed.data;
}

export function publicEnvStatus() {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });

  return {
    convex: {
      configured: parsed.success,
      issues: parsed.success ? [] : parsed.error.issues.map((i) => i.path.join('.') || '(root)'),
    },
  };
}

export function serverEnvStatus() {
  // We treat Stream as optional; only fail if the *pair* is incomplete.
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;
  const account = process.env.CLOUDFLARE_STREAM_ACCOUNT_ID;
  const streamPairOk = (!token && !account) || (!!token && !!account);

  return {
    server: {
      cloudflareStreamConfigured: streamPairOk && !!token && !!account,
      cloudflareStreamPairOk: streamPairOk,
      ingestKeyConfigured: !!process.env.CLAWTUBE_INGEST_KEY,
      convexAuthMiddlewareEnabled: true,
    },
  };
}

export function requireCloudflareStream() {
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;
  const accountId = process.env.CLOUDFLARE_STREAM_ACCOUNT_ID;
  if (!token || !accountId) {
    throw new Error('Missing CLOUDFLARE_STREAM_TOKEN or CLOUDFLARE_STREAM_ACCOUNT_ID');
  }
  return { token, accountId };
}

export function ingestAllowed(req: Request) {
  const configured = process.env.CLAWTUBE_INGEST_KEY;
  if (!configured) return true; // dev convenience

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : null;
  return token === configured;
}

const r2Schema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_BASE_URL: z.string().url(),
});

type R2Env = z.infer<typeof r2Schema>;

export function requireR2Env(): R2Env {
  const parsed = r2Schema.safeParse({
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
  });

  if (!parsed.success) {
    throw new Error(`Missing/invalid R2 env.\n${parsed.error.message}`);
  }

  return parsed.data;
}

export function r2EnvStatus() {
  const parsed = r2Schema.safeParse({
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
  });

  return {
    r2: {
      configured: parsed.success,
      issues: parsed.success ? [] : parsed.error.issues.map((i) => i.path.join('.') || '(root)'),
    },
  };
}
