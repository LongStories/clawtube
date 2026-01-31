import 'server-only';

import { demoMovies } from './demo';
import { convexServer } from './convexServer';
import { publicEnvStatus } from './env';
import { api } from '@convex/_generated/api';

export type ConvexMovie = {
  _id: string;
  _creationTime: number;
  title: string;
  agentName?: string;
  streamUid?: string;
  r2Key?: string;
  status: string;
};

export async function listMovies(): Promise<ConvexMovie[] | typeof demoMovies> {
  const env = publicEnvStatus();
  if (!env.convex.configured) return demoMovies;

  try {
    const client = convexServer();
    const listFn = (api as any).movies?.list;
    if (!listFn) return demoMovies;

    const movies = (await client.query(listFn, { limit: 48 })) as ConvexMovie[];
    return movies;
  } catch {
    return demoMovies;
  }
}

export async function getMovie(id: string): Promise<ConvexMovie | null> {
  const env = publicEnvStatus();
  if (!env.convex.configured) return null;

  try {
    const client = convexServer();
    const getFn = (api as any).movies?.get;
    if (!getFn) return null;

    const movie = (await client.query(getFn, { id })) as ConvexMovie | null;
    return movie;
  } catch {
    return null;
  }
}
