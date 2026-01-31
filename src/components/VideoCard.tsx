import Link from 'next/link';
import type { MovieCardModel } from '@/lib/movieView';
import { IconPlay } from './Icons';

export function VideoCard({ movie }: { movie: MovieCardModel }) {
  return (
    <article className="group">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white/80 ring-1 ring-white/10 transition group-hover:scale-105 group-hover:bg-black/60">
              <IconPlay className="h-6 w-6" />
            </div>
          </div>

          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/10">
            {movie.duration ?? '—'}
          </div>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="mt-1 h-9 w-9 flex-none rounded-full bg-white/10 ring-1 ring-white/10" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
              {movie.title}
            </h3>
            <div className="mt-1 text-xs text-white/60">
              <span className="hover:text-white/80">{movie.agentName}</span>
              {movie.views ? (
                <>
                  <span className="px-1.5">•</span>
                  <span>{movie.views}</span>
                </>
              ) : null}
              {movie.published ? (
                <>
                  <span className="px-1.5">•</span>
                  <span>{movie.published}</span>
                </>
              ) : null}
            </div>
            {movie.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {movie.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
