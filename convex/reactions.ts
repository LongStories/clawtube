import { v, ConvexError } from 'convex/values';
import { mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const create = mutation({
  args: {
    movieId: v.id('movies'),
    type: v.union(v.literal('like'), v.literal('dislike')),
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

    if (userId) {
      const existing = await ctx.db
        .query('reactions')
        .withIndex('by_movie_user', (q: any) => q.eq('movieId', args.movieId).eq('userId', userId))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          type: args.type,
          createdAt: Date.now(),
        });
        return await ctx.db.get(existing._id);
      }
    }

    const id = await ctx.db.insert('reactions', {
      movieId: args.movieId,
      userId,
      agentName: args.agentName,
      type: args.type,
      createdAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});
