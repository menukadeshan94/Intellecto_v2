import React from 'react'
import QuizCard from '../../../../components/quiz/QuizCard'
import { auth } from '@clerk/nextjs/server'
import prisma from '../../../../utils/connect';
import UserwithDarkMode from '../../../../components/UserwithDarkMode/UserwithDarkMode';
import { redirect } from 'next/navigation';

async function page({params}: any) {
  try {
    const {categoryId} = await params;
    const {userId} = await auth();

    // Redirect if no user is authenticated
    if (!userId) {
      redirect('/sign-in');
    }

    if(!categoryId){
      return null;
    }

    const quizzes = await prisma.quiz.findMany({
      where: {categoryId},
      include: {
        questions : {
          select : {
            id : true,
            text : true,
            difficulty: true,
            options :{
              select:{
                id : true,
                text : true,
                isCorrect : true,
              }
            }
          }
        }
      },
      orderBy :{ 
        id : "asc",
      }, 
    });

    console.log("quizzes", quizzes)

    return (
      <div>
        <div className='flex justify-between'>
          <h1 className="mb-6 text-4xl font-bold">All Quizzes</h1>
          <UserwithDarkMode></UserwithDarkMode>
        </div>

        {quizzes.length > 0 ? (
          <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
            {quizzes.map((quiz) =>(
              <QuizCard key={quiz.id}  quiz={quiz}/>
            ))}
          </div>
          ) : (
          <h1 className="text-2xl text-center mt-4">No Quizzes</h1>
          ) }
      </div>
    )
  } catch (error) {
    console.error('Error in categories page:', error);
    // You might want to redirect to an error page or show an error message
    return (
      <div>
        <h1>Error loading quizzes</h1>
        <p>Please try again later.</p>
      </div>
    );
  }
}

export default page