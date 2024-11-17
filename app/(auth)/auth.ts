import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

import { apiAuthPrefix, authRoutes, redirectAfterLogin } from '@/routes';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user?.email;
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      // API routes are always accessible
      if (isApiAuthRoute) {
        return true;
      }

      // Handle auth routes (e.g. /login)
      if (isAuthRoute) {
        // Redirect to home if already logged in
        if (isLoggedIn) {
          return Response.redirect(new URL(redirectAfterLogin, nextUrl));
        }
        return true;
      }

      // For all other routes, redirect to login if not authenticated
      if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }

      return isLoggedIn;
    },
  },
});
