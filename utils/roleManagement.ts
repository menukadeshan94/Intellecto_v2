// utils/roleManagement.ts
import { createClerkClient } from '@clerk/nextjs/server';

/**
 * Check if user has admin role
 */
export function isAdmin(user: any): boolean {
  return user?.publicMetadata?.role === 'admin';
}

/**
 * Check if user is a student (everyone who is not admin)
 */
export function isStudent(user: any): boolean {
  return user?.publicMetadata?.role !== 'admin';
}

/**
 * Only used for removing admin role if needed
 */
export async function removeAdminRole(userId: string) {
  try {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: null, // Remove admin role, user becomes student by default
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error removing admin role:', error);
    return { success: false, error };
  }
}

// Example API route for admin operations
// This shows how to protect API routes for admin-only actions
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user to verify admin role
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    const currentUser = await clerkClient.users.getUser(currentUserId);
    
    // Only users with explicit admin role can perform admin actions
    if (!isAdmin(currentUser)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Handle admin operations (like creating quizzes, managing users, etc.)
    // Your admin logic here...

    return NextResponse.json({ message: 'Admin operation successful' });
  } catch (error) {
    console.error('Admin operation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}