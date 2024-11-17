export { auth as middleware } from '@/app/(auth)/auth';

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
};
