import { convexAuthNextjsMiddleware } from '@convex-dev/auth/nextjs/server';

// Next.js 16 renamed middleware.ts → proxy.ts. The Convex Auth helper is still
// named `convexAuthNextjsMiddleware`, but it works as the proxy function.
export default convexAuthNextjsMiddleware();

export const config = {
  matcher: [
    // Run on all routes except Next internals / static assets.
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
