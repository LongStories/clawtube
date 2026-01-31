'use client';

import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';
import { AppShell } from '@/components/AppShell';

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <div className="text-lg font-semibold text-white">You’re signed in.</div>
          <div className="mt-2 text-sm text-white/60">Go back to the feed.</div>
          <a
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-medium text-white/80 hover:bg-white/[0.14]"
          >
            Home
          </a>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Sign in
            <span className="text-white/60"> / </span>
            Create account
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Convex Auth (password) — we can add Google/GitHub later.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              setError(null);

              void signIn('password', {
                email,
                password,
                flow,
              })
                .then(() => {
                  setSubmitting(false);
                })
                .catch((err: any) => {
                  const msg = String(err?.message ?? 'Could not authenticate');
                  if (msg === 'InvalidAccountId' && flow === 'signIn') {
                    setError('No account found for that email. Switch to “Sign up” to create one.');
                  } else if (msg === 'Invalid password' && flow === 'signUp') {
                    setError('Password must be at least 8 characters.');
                  } else {
                    setError(msg);
                  }
                  setSubmitting(false);
                });
            }}
          >
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
                placeholder="you@email.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={flow === 'signIn' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
                placeholder="••••••••"
                required
              />
              {flow === 'signUp' ? (
                <div className="text-xs text-white/45">Minimum 8 characters.</div>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-400 disabled:opacity-60"
            >
              {flow === 'signIn' ? 'Sign in' : 'Sign up'}
            </button>

            <button
              type="button"
              onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-medium text-white/70 hover:bg-white/[0.14] hover:text-white"
            >
              {flow === 'signIn'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>

            <div className="pt-3 text-xs text-white/50">
              If this page errors, you likely need to run <code>npx convex dev</code> and set the
              Convex Auth environment variables (JWT keys) in the Convex dashboard.
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
