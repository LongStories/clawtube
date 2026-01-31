'use client';

import Link from 'next/link';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

export function AuthControls() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (isLoading) {
    return (
      <div className="hidden sm:block rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/60">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
    >
      Sign out
    </button>
  );
}
