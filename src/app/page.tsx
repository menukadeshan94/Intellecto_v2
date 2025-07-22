'use client';
import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGlobalContext } from '../../context/globalContext';
import HomeCard from '../../components/quiz/HomeCard';
import ThemeToggle from '../../components/ThemeToggle';
import { ICategory } from '../../types/types';
import CreativeLoginScreen from '../../components/CreativeLoginScreen/CreativeLoginScreen';
import UserwithDarkMode from '../../components/UserwithDarkMode/UserwithDarkMode';

const QuizCategoriesPage: React.FC = () => {
  const { categories } = useGlobalContext();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }
    
    return categories.filter((category: ICategory) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  

  

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className='flex items-center justify-between mb-6'>
          <h1 className="text-4xl font-bold text-primary">
            Intellecto Quiz Catalog
          </h1>
          <UserwithDarkMode/>
          
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredCategories.length === 0 
                ? `No categories found for "${searchTerm}"` 
                : `Found ${filteredCategories.length} categor${filteredCategories.length === 1 ? 'y' : 'ies'} for "${searchTerm}"`
              }
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {filteredCategories.length === 0 && !searchTerm ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No categories available at the moment.
              </p>
            </div>
          ) : filteredCategories.length === 0 && searchTerm ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No categories match your search.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-primary hover:text-primary/80 underline transition-colors"
              >
                Clear search to see all categories
              </button>
            </div>
          ) : (
            filteredCategories.map((category: ICategory) => (
              <HomeCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCategoriesPage;