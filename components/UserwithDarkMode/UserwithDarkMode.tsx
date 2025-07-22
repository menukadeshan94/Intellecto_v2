'use client';
import React from 'react';
import { useUser } from '@clerk/nextjs';
import ThemeToggle from '../ThemeToggle';

function UserwithDarkMode() {
  const { user, isLoaded } = useUser();
  
  const toSentenceCase = (name: string | null | undefined) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return (
    <div className="flex items-center gap-4">
        <p className='text-xl font-bold text-primary'>
            Loading...
        </p>
        <ThemeToggle />
    </div>
    
    );
  }

  return (
  <div className="flex items-center gap-4">
    <p className='text-xl font-bold text-primary'>
        Welcome, {user?.firstName ? toSentenceCase(user.firstName) : 'Guest'}
    </p>
    <ThemeToggle />
  </div>
   


  );
}

export default UserwithDarkMode;