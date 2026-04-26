// Shared config for all route pages:
// Force dynamic rendering (SSR) instead of static generation.
// Our pages are driven by client-side contexts (language, admin data)
// and do not benefit from static prerendering.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
