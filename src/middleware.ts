// middleware.ts - Optimized version
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Move imports to top level for better performance
const isDev = process.env.NODE_ENV === 'development';

// Define route matchers
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/quiz/public(.*)',
  '/unauthorized',
  '/api/user/register',
  '/api/categories',
]);

// Simple in-memory cache for user roles (expires after 5 minutes)
const roleCache = new Map<string, { role: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getUserRole(userId: string): Promise<string | null> {
  // Check cache first
  const cached = roleCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.role;
  }

  try {
    // Only import when needed and cache the import
    const { createClerkClient } = await import('@clerk/nextjs/server');
    
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string || 'user';
    
    // Cache the result
    roleCache.set(userId, { role: userRole, timestamp: Date.now() });
    
    // Clean up old cache entries (simple cleanup)
    if (roleCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of roleCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          roleCache.delete(key);
        }
      }
    }
    
    return userRole;
  } catch (error) {
    if (isDev) console.error('❌ Error checking user role:', error);
    return null;
  }
}

export default clerkMiddleware(async (auth, req) => {
  if (isDev) console.log('🔍 Middleware running for:', req.nextUrl.pathname);
  
  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    if (isDev) console.log('✅ Public route, allowing access');
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  if (isDev) console.log('👤 User ID in middleware:', userId);
  
  // Redirect to sign-in if user is not authenticated
  if (!userId) {
    if (isDev) console.log('🚫 No user, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Check admin routes
  if (isAdminRoute(req)) {
    // First try to get role from session claims (fastest)
    let userRole = (sessionClaims?.metadata as any)?.role as string;
    
    // If not in session claims, check cache or API
    if (!userRole) {
      userRole = await getUserRole(userId) || 'user';
    }
    
    if (userRole !== 'admin') {
      if (isDev) console.log('🚫 User is not admin - redirecting to unauthorized');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (isDev) console.log('✅ Admin access granted');
  }

  if (isDev) console.log('✅ Middleware allowing access');
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};