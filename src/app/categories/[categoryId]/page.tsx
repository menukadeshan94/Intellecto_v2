import React from 'react'
import QuizCard from '../../../../components/quiz/QuizCard'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '../../../../utils/connect';
import UserwithDarkMode from '../../../../components/UserwithDarkMode/UserwithDarkMode';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ categoryId: string }>
}

async function CategoryPage({ params }: PageProps) {
  try {
    const { categoryId } = await params;
    
    // Use currentUser() instead of auth() - this doesn't require middleware detection
    const user = await currentUser();

    // Redirect if no user is authenticated
    if (!user) {
      redirect('/sign-in');
    }

    if (!categoryId) {
      return null;
    }

    const quizzes = await prisma.quiz.findMany({
      where: { categoryId },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            difficulty: true,
            options: {
              select: {
                id: true,
                text: true,
                isCorrect: true,
              }
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
          }
        },
        creator: {
          select: {
            id: true,
            clerkId: true,
            role: true,
          }
        }
      },
      orderBy: { 
        id: "asc",
      }, 
    });

    // Serialize dates to strings for client components
    const serializedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString()
    }));

    return (
      <div>
        <div className='flex justify-between'>
          <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>
          <UserwithDarkMode />
        </div>

        {serializedQuizzes.length > 0 ? (
          <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
            {serializedQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <h1 className="text-2xl text-center mt-4">No Quizzes</h1>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error in categories page:', error);
    return (
      <div>
        <h1>Error loading quizzes</h1>
        <p>Please try again later.</p>
      </div>
    );
  }
}

export default CategoryPage