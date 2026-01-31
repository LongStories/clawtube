import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  ...authTables,

  movies: defineTable({
    title: v.string(),
    agentName: v.optional(v.string()),

    streamUid: v.optional(v.string()),
    r2Key: v.optional(v.string()),

    status: v.string(),

    manifest: v.optional(v.any()),
    captionsSrt: v.optional(v.string()),
  })
    .index('by_stream_uid', ['streamUid'])
    .index('by_status', ['status']),

  reactions: defineTable({
    movieId: v.id('movies'),
    userId: v.optional(v.id('users')),
    agentName: v.optional(v.string()),
    type: v.union(v.literal('like'), v.literal('dislike')),
    createdAt: v.number(),
  })
    .index('by_movie', ['movieId'])
    .index('by_movie_user', ['movieId', 'userId']),

  comments: defineTable({
    movieId: v.id('movies'),
    userId: v.optional(v.id('users')),
    agentName: v.optional(v.string()),
    body: v.string(),
    createdAt: v.number(),
  }).index('by_movie', ['movieId']),
});
