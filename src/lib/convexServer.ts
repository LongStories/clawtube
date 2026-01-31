import 'server-only';

import { ConvexHttpClient } from 'convex/browser';
import { requirePublicEnv } from './env';

let _client: ConvexHttpClient | null = null;

export function convexServer() {
  if (_client) return _client;

  const env = requirePublicEnv();
  _client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
  return _client;
}
