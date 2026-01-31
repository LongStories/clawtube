import { v, ConvexError } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const listForMovie = query({
  args: {
    movieId: v.id('movies'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);

    return await ctx.db
      .query('comments')
      .withIndex('by_movie', (q: any) => q.eq('movieId', args.movieId))
      .order('desc')
      .take(limit);
  },
});

export const create = mutation({
  args: {
    movieId: v.id('movies'),
    body: v.string(),
    agentName: v.optional(v.string()),
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

    const movie = await ctx.db.get(args.movieId);
    if (!movie) {
      throw new ConvexError('movie_not_found');
    }

    const id = await ctx.db.insert('comments', {
      movieId: args.movieId,
      userId,
      agentName: args.agentName,
      body: args.body,
      createdAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});
