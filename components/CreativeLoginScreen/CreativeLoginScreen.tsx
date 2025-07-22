'use client';
import { SignInButton } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

// ─── Component ──────────────────────────────────────────────────────────────────
const CreativeLoginScreen: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // Generate floating particles
    const particleArray: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    setParticles(particleArray);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center">
      {/* ── Animated Background Particles ── */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.speed * 3}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* ── Geometric Background Elements ── */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-cyan-400 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute bottom-20 right-20 w-24 h-24 border-2 border-pink-400 rotate-45 animate-bounce"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg animate-pulse" />
        <div
          className="absolute bottom-1/3 left-1/3 w-20 h-20 border-2 border-green-400 rounded-full animate-ping"
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* ── Main Content Card ── */}
      <div
        className={`relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md w-full mx-4 transform transition-all duration-1000 ${
          isLoaded
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        {/* Animated Logo/Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300 animate-pulse">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" />
          </div>

          <h1 className="text-3xl font-bold text-amber-50 mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
            Intellecto Quiz
          </h1>
          <p className="text-white/70 text-lg">Your Learning Journey Awaits</p>
        </div>

        {/* Login Message */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="inline-block p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl border border-yellow-400/30">
              <svg
                className="w-8 h-8 text-yellow-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-white font-semibold text-xl">Access Required</p>
            </div>

            <p className="text-white/80 text-base leading-relaxed">
              Please sign in to unlock your personalized quiz experience and
              track your progress
            </p>
          </div>

          {/* Clerk Sign-In Button */}
          <SignInButton mode="modal">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign In to Continue</span>
              </div>
            </button>
          </SignInButton>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: '🧠', label: 'Smart Quizzes' },
              { icon: '📊', label: 'Progress Tracking' },
              { icon: '🎯', label: 'Targeted Learning' },
              { icon: '🏆', label: 'Achievements' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="text-center p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-white/70 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce cursor-pointer hover:scale-110 transition-transform">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse cursor-pointer hover:scale-110 transition-transform">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CreativeLoginScreen;