'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { admin, chart, home } from '../utils/icons';
import { SignedIn, UserButton, SignedOut, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const menu = [
  {
    name: 'Home',
    href: '/',
    icon: home,
    ariaLabel: 'Navigate to home page'
  },
  {
    name: 'My Stats',
    href: '/stats',
    icon: chart,
    ariaLabel: 'View your quiz statistics'
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: admin,
    ariaLabel: 'Creating quizzes'
  }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="min-h-[8vh] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40 border-b-2 flex items-center bg-zinc-700">
      <nav className="flex-1 flex items-center justify-between" role="navigation" aria-label="Main navigation">
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Quiz Web App - Go to homepage"
        >
          <Image 
            src="/logo.png" 
            alt="Quiz Web App Logo" 
            width={50} 
            height={50}
            className="rounded-lg"
            style={{ height: 'auto', width: 'auto' }}
          />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400">
            Intellecto
          </h1>
        </Link>

        {/* Navigation Menu */}
        <ul className="hidden md:flex items-center gap-4 lg:gap-8 text-lg font-semibold">
          {menu.map(item => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`py-2 px-3 lg:px-6 flex items-center gap-2 text-sm lg:text-lg leading-none rounded-lg transition-all duration-200 hover:scale-105
                    ${active
                      ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400 shadow-lg'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}
                  `}
                  aria-label={item.ariaLabel}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="text-xl lg:text-2xl text-blue-400">{item.icon}</span>
                  <span
                    className={`font-bold uppercase ${
                      active ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Authentication Section */}
        <div className="flex justify-between gap-4">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-400 hover:border-blue-300 transition-colors',
                  userButtonAvatarImage: 'rounded-full',
                },
              }}
            />
          </SignedIn>
          <SignedIn>
            <SignOutButton>
              <button onClick={()=>{alert("Do you want to sign out...?")}} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-zinc-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="Quiz Web App Logo" 
                width={50} 
                height={50}
                className="rounded-lg"
              />
              <h2 className="text-xl font-bold text-blue-400">Menu</h2>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-4">
              {menu.map(item => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`w-full py-4 px-4 flex items-center gap-3 text-lg rounded-lg transition-all duration-200
                        ${active
                          ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}
                      `}
                      aria-label={item.ariaLabel}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="text-2xl text-blue-400">{item.icon}</span>
                      <span className={`font-semibold ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Auth Section */}
          <div className="p-6 border-t border-gray-600">
            <SignedIn>
              <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-12 h-12 rounded-full border-2 border-blue-400',
                      userButtonAvatarImage: 'rounded-full',
                      userButtonAction: 'hidden',
                      userButtonProfile: 'hidden',
                    },
                  }}
                />
                <span className="text-gray-300 font-medium">Profile</span>
              </div>
            </SignedIn>
            <SignedOut>
              <Button 
                onClick={() => {
                  router.push('/sign-in');
                  closeMobileMenu();
                }} 
                className='w-full py-4 bg-blue-400 flex items-center justify-center gap-2 text-lg font-semibold rounded-lg hover:bg-blue-500 transition-colors duration-200'
                aria-label="Sign in or create account"
              >
                Login / Sign up
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}