"use client";
import React, { useState, useCallback } from 'react'
import { IQuiz } from '../../types/types';
import Image from 'next/image';
import { dots } from '../../utils/icons';
import { useRouter } from 'next/navigation'; 
import { useGlobalContext } from '../../context/globalContext';

interface Props {
  quiz: IQuiz;
}

function QuizCard({quiz}:Props) {
  const router = useRouter();
  const {setSelectedQuiz} = useGlobalContext();

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    try {
      setSelectedQuiz(quiz);
      router.push(`/quiz/setup/${quiz.id}`); 
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [router, quiz.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className="group bg-card text-card-foreground border-2 border-border rounded-xl 
        p-1 cursor-pointer 
        shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] 
        dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.05)]
        hover:-translate-y-1 hover:shadow-[0_.4rem_0_0_rgba(0,0,0,0.15)] 
        dark:hover:shadow-[0_.4rem_0_0_rgba(255,255,255,0.1)]
        transition-all duration-300 ease-in-out
        w-full h-full
        
        /* Mobile First - xs to sm */
        min-h-[280px] max-w-[280px] mx-auto
        
        /* Small screens - sm */
        sm:min-h-[320px] sm:max-w-[320px]
        
        /* Medium screens - md */
        md:min-h-[360px] md:max-w-[360px]
        
        /* Large screens - lg */
        lg:min-h-[380px] lg:max-w-[380px]
        
        /* Extra large screens - xl */
        xl:min-h-[400px] xl:max-w-[400px]
        
        /* 2xl screens */
        2xl:min-h-[420px] 2xl:max-w-[420px]
        
        /* Focus states for accessibility */
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        focus:ring-offset-background
        
        /* Active state */
        active:scale-[0.98] active:shadow-[0_.2rem_0_0_rgba(0,0,0,0.1)]
        dark:active:shadow-[0_.2rem_0_0_rgba(255,255,255,0.05)]"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Start ${quiz.title} quiz with ${quiz.questions.length} questions`}
    >
      <div className='flex flex-col h-full'>
        {/* Image Container - Responsive heights */}
        <div className="rounded-xl overflow-hidden bg-[#97dbff]/20 relative
          /* Mobile to tablet image heights */
          h-[140px] 
          sm:h-[160px] 
          md:h-[180px] 
          lg:h-[200px] 
          xl:h-[220px]
          2xl:h-[240px]
          
          /* Subtle hover effect on image */
          group-hover:bg-[#97dbff]/30 transition-colors duration-300">
          
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          )}
          
          <Image
            src={
              quiz.image ||
              `/categories/image--${quiz.title
                .toLowerCase()
                .split(" ")
                .join("-")}.svg`
            }
            alt={`${quiz.title} quiz image`}
            width={400}
            height={300}
            className={`h-full w-full rounded-xl object-cover transition-all duration-300 
              ${imageLoading ? 'opacity-0' : 'opacity-100'}
              group-hover:scale-105`}
            priority
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, (max-width: 1280px) 380px, 400px"
          />
          
          {imageError && (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-gray-400 text-center p-2 sm:p-3 md:p-4">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-2">📝</div>
                <p className="text-xs sm:text-sm font-medium">Quiz Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Content - Flexible spacing */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 sm:space-y-3">
          <div className="flex-1">
            <h2 className="font-bold leading-tight mb-1 sm:mb-2 line-clamp-2
              text-base sm:text-lg md:text-xl lg:text-2xl
              group-hover:text-primary transition-colors duration-300">
              {quiz.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 leading-snug font-medium 
              line-clamp-2 sm:line-clamp-3
              text-xs sm:text-sm md:text-base">
              {quiz.description}
            </p>
          </div>

          {/* Questions Count - Always at bottom */}
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-gray-400 dark:text-gray-500 text-sm sm:text-base md:text-lg">
                {dots}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                <span className="text-gray-400 dark:text-gray-500 font-medium
                  text-xs sm:text-sm">
                  Questions:
                </span>
                <span className="font-bold text-gray-600 dark:text-gray-300
                  text-sm sm:text-base md:text-lg">
                  {quiz.questions.length}
                </span>
              </div>
            </div>
            
            {/* Optional: Add a subtle arrow indicator */}
            <div className="text-gray-400 dark:text-gray-500 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300
              text-sm sm:text-base">
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizCard