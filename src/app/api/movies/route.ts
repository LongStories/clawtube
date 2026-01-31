import { NextResponse } from 'next/server';
import { listMovies } from '@/lib/movies';

export async function GET() {
  const movies = await listMovies();

  return NextResponse.json({
    ok: true,
    movies,
  });
}
