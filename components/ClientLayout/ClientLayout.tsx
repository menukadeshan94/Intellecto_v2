'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Headers from '../../components/Header';
import CreativeLoginScreen from '../../components/CreativeLoginScreen/CreativeLoginScreen';
import Footer from '../Footer/Footer';
import { Toaster } from 'react-hot-toast';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // Handle mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Early return for unmounted state
  if (!mounted) return null;

  // Loading state with improved UX
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-background dark:to-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading Intellecto…</p>
        </div>
      </div>
    );
  }

  // Authenticated view with conditional layout
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {user ? (
        <>
          {isAdminRoute ? (
            <>
            <Headers />
            <div className="min-h-screen">
              
              {children}
              
            </div>
            
            </>
          ) : (
            // Regular routes get the normal layout with header and footer
            <>
              <Toaster position='top-center'/>
              <Headers />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <Footer />
            </>
          )}
        </>
      ) : (
        <CreativeLoginScreen />
      )}
    </div>
  );
}