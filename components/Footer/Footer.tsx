'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  Github, 
  Mail, 
  Twitter, 
  ChevronUp, 
  ChevronDown,
  Send,
  ExternalLink 
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Footer() {
  const currentYear = 2024;
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    // You can add toast notification here
  };

  const quickLinks = [
    { href: '/', label: 'Home', show: !!user },
    { href: '/stats', label: 'My Stats', show: !!user },
    { href: '/about', label: 'About', show: true },
    { href: '/contact', label: 'Contact', show: true },
  ].filter(link => link.show);

  const socialLinks = [
    { href: '#', icon: Twitter, label: 'Twitter', color: 'hover:text-blue-400' },
    { href: '#', icon: Github, label: 'GitHub', color: 'hover:text-gray-300' },
    { href: '#', icon: Mail, label: 'Email', color: 'hover:text-green-400' },
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/cookies', label: 'Cookies' },
  ];

  return (
    <footer className="bg-gradient-to-t from-zinc-900 to-zinc-800 border-t border-zinc-700/50 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Expandable Section */}
        <div className="lg:hidden">
          <div className="py-6 border-b border-zinc-700/30">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Quiz Web App Logo" 
                  width={28} 
                  height={28}
                  className="rounded-lg"
                />
                <h3 className="text-lg font-bold text-blue-400">Intellecto</h3>
              </Link>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-zinc-700/50 transition-colors"
                aria-label={isExpanded ? 'Collapse footer' : 'Expand footer'}
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {/* Expandable Content */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-6 space-y-6">
              {/* Quick Links Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Links Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">Connect</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`p-2 rounded-lg bg-zinc-700/30 ${social.color} transition-all hover:scale-105`}
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Mobile */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-3">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block py-12">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Brand Section */}
            <div className="col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-3 w-fit">
                <Image 
                  src="/logo.png" 
                  alt="Quiz Web App Logo" 
                  width={36} 
                  height={36}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold text-blue-400">Intellecto</h3>
              </Link>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Challenge yourself with our interactive quiz platform. Test your knowledge 
                across various topics and track your progress with detailed analytics.
              </p>
              
              {/* Social Links Desktop */}
              <div className="flex space-x-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`p-2.5 rounded-lg bg-zinc-700/30 ${social.color} transition-all hover:scale-105 hover:bg-zinc-700/50`}
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Desktop */}
            <div className="col-span-3 space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Desktop */}
            <div className="col-span-5 space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">Stay Updated</h4>
              <p className="text-sm text-gray-400">
                Get notified about new quizzes, features, and updates.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-zinc-700/50 border border-zinc-600 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-zinc-700/50 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} Intellecto.</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-blue-400 transition-colors px-2 py-1 rounded"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Made with Love */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-current animate-pulse" />
              <span>for learning</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}