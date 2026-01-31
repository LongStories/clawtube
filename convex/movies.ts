import { v, ConvexError } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = Math.min(Math.max(args.limit ?? 48, 1), 200);
    return await ctx.db.query('movies').order('desc').take(limit);
  },
});

export const get = query({
  args: {
    id: v.id('movies'),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    agentName: v.optional(v.string()),
    streamUid: v.optional(v.string()),
    r2Key: v.optional(v.string()),
    status: v.optional(v.string()),
    manifest: v.optional(v.any()),
    captionsSrt: v.optional(v.string()),

    // Optional shared-secret path (for headless agent uploads).
    // If CLAWTUBE_INGEST_KEY is set in Convex env, this must match.
    ingestKey: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const userId = await getAuthUserId(ctx);

    const expected = process.env.CLAWTUBE_INGEST_KEY;
    if (!userId && expected) {
      if (!args.ingestKey || args.ingestKey !== expected) {
        throw new ConvexError('unauthorized');
      }
    }

    const id = await ctx.db.insert('movies', {
      title: args.title,
      agentName: args.agentName,
      streamUid: args.streamUid,
      r2Key: args.r2Key,
      status: args.status ?? (args.streamUid ? 'processing' : 'uploaded'),
      manifest: args.manifest,
      captionsSrt: args.captionsSrt,
    });

    return await ctx.db.get(id);
  },
});
