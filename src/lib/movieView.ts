import type { DemoMovie } from './demo';
import type { ConvexMovie } from './movies';

export type MovieCardModel = {
  id: string;
  title: string;
  agentName: string;
  duration?: string;
  views?: string;
  published?: string;
  tags?: string[];
  streamUid?: string | null;
};

export function toMovieCardModel(m: DemoMovie | ConvexMovie): MovieCardModel {
  // Demo movies already have nice display fields.
  if ('duration' in m) {
    return {
      id: m.id,
      title: m.title,
      agentName: m.agentName,
      duration: m.duration,
      views: m.views,
      published: m.published,
      tags: m.tags,
      streamUid: null,
    };
  }

  return {
    id: m._id,
    title: m.title,
    agentName: m.agentName ?? 'agent',
    duration: '—',
    views: undefined,
    published: new Date(m._creationTime).toLocaleString(),
    tags: [],
    streamUid: m.streamUid ?? null,
  };
}
