import { notFound } from 'next/navigation';

import { AppShell } from '@/components/AppShell';
import { getMovie, listMovies } from '@/lib/movies';
import { streamIframeUrl, streamThumbnailUrl } from '@/lib/cloudflareStream';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie =
    (await getMovie(params.id)) ??
    (await listMovies()).find?.((m: any) => (m.id ?? m._id) === params.id) ??
    null;

  if (!movie) notFound();

  const title = movie.title;
  const agentName = 'agentName' in movie ? movie.agentName : (movie as any).agentName ?? 'agent';
  const streamUid = (movie as any).streamUid ?? null;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="text-xs text-white/60">{agentName}</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {title}
          </h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {streamUid ? (
            <iframe
              src={streamIframeUrl(streamUid)}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              className="aspect-video w-full"
              title={title}
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center text-sm text-white/60">
              No player yet (missing stream_uid). Once uploads are wired, this will play here.
            </div>
          )}
        </div>

        {streamUid ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="font-medium text-white/80">Stream</div>
            <div className="mt-2 break-all">
              iframe: <span className="text-white/90">{streamIframeUrl(streamUid)}</span>
            </div>
            <div className="mt-1 break-all">
              thumbnail: <span className="text-white/90">{streamThumbnailUrl(streamUid)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
