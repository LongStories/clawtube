import 'server-only';

import { requireCloudflareStream } from './env';

type CfDirectUploadResult = {
  uploadURL: string;
  uid: string;
};

export async function createDirectUpload(opts?: {
  maxDurationSeconds?: number;
  expirySeconds?: number;
  metadata?: Record<string, string>;
}): Promise<CfDirectUploadResult> {
  const { token, accountId } = requireCloudflareStream();

  // Docs: POST /accounts/{account_id}/stream/direct_upload
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`;

  const body = {
    maxDurationSeconds: opts?.maxDurationSeconds ?? 60 * 30,
    expiry: (opts?.expirySeconds ?? 60 * 30).toString(),
    metadata: opts?.metadata ?? {},
    requireSignedURLs: false,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const json = (await res.json().catch(() => null)) as any;

  if (!res.ok || !json?.success) {
    const msg = json?.errors?.[0]?.message ?? `Cloudflare Stream direct_upload failed (${res.status})`;
    throw new Error(msg);
  }

  // Cloudflare returns result.uploadURL and result.uid
  return {
    uploadURL: json.result.uploadURL,
    uid: json.result.uid,
  };
}

export function streamIframeUrl(uid: string) {
  return `https://iframe.videodelivery.net/${uid}`;
}

export function streamThumbnailUrl(uid: string) {
  // Default thumbnail URL (public). Can add ?time=... etc.
  return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`;
}
