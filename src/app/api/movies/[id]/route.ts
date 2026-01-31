import { NextResponse } from 'next/server';
import { getMovie, listMovies } from '@/lib/movies';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const movie =
    (await getMovie(id)) ??
    (await listMovies()).find?.((m: any) => (m.id ?? m._id) === id) ??
    null;

  if (!movie) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, movie });
}
