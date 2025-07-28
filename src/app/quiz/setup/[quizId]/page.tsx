'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { play } from '../../../../../utils/icons';
import { Button } from '@/components/ui/button';
import { useGlobalContext } from '../../../../../context/globalContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Page() {
  const router = useRouter();
  const { quizSetup, setQuizSetup, selectedQuiz } = useGlobalContext();
  
  useEffect(() => {
    if (!selectedQuiz) {
      router.push("/"); 
    } else {
      // Initialize quizSetup with defaults if not already set
      if (!quizSetup || !quizSetup.difficulty) {
        setQuizSetup((prev: any) => ({
          ...prev,
          questionsCount: prev?.questionsCount || 1,
          difficulty: prev?.difficulty || "unspecified"
        }));
      }
    }
  }, [selectedQuiz, router, setQuizSetup]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const maxQuestions = selectedQuiz?.questions?.length || 1;
    const newCount = isNaN(value) || value < 1 ? 1 : Math.min(value, maxQuestions);

    setQuizSetup((prev: any) => ({ ...prev, questionsCount: newCount }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    setQuizSetup((prev: any) => ({ ...prev, difficulty }));
    console.log("Difficulty: ", difficulty);
  };

  const startQuiz = async () => {
    if (!selectedQuiz?.questions) {
      toast.error("No quiz questions available");
      return;
    }

    // Filter questions based on difficulty if specified
    let filteredQuestions = selectedQuiz.questions;
    
    if (quizSetup?.difficulty && quizSetup.difficulty !== 'unspecified') {
      filteredQuestions = selectedQuiz.questions.filter(
        (q: { difficulty: string }) => 
          q.difficulty?.toLowerCase() === quizSetup.difficulty.toLowerCase()
      );
    }

    // Get the specified number of questions
    const selectedQuestions = filteredQuestions.slice(0, quizSetup?.questionsCount || 1);

    if (selectedQuestions.length > 0) {
      try {
        // Update the db for quiz attempt start
        await axios.post("/api/user/quiz/start", {
          categoryId: selectedQuiz?.categoryId,
          quizId: selectedQuiz?.id,
        });
        
        // Push to the quiz page
        router.push("/quiz");
      } catch (error) {
        console.log("Error starting quiz: ", error);
        toast.error("Failed to start quiz. Please try again.");
      }
    } else {
      toast.error("No questions found for the selected criteria");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground-900 mb-2">Quiz Setup</h1>
            <p className="text-foreground-600">Configure your quiz preferences</p>
          </div>

          <div>
            <Label htmlFor="quizTitle" className="text-sm font-medium text-foreground-700 mb-2">
              Quiz Title
            </Label>
            <Input
              type="text"
              id="quizTitle"
              value={selectedQuiz?.title || ""}
              readOnly
              className="w-full bg-background cursor-not-allowed"
            />
          </div>

          {/* Question count */}
          <div className="space-y-2">
            <Label htmlFor="questionCount" className="text-sm font-medium text-foreground-700">
              Number of Questions
            </Label>
            <Input
              type="number"
              min={1}
              id="questionCount"
              value={quizSetup?.questionsCount || 1}
              onChange={handleQuestionChange}
              max={selectedQuiz?.questions?.length || 1}
              className="w-full"
            />
          </div>

          {/* Difficulty select */}
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-medium text-foreground">
              Difficulty
            </Label>
            <Select
              value={quizSetup?.difficulty || "unspecified"}
              onValueChange={(value) => handleDifficultyChange(value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unspecified">Unspecified</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit button */}
          <Button
            onClick={startQuiz}
            disabled={!selectedQuiz}
            className="w-full bg-background hover:bg-zinc-700 disabled:bg-gray-400 
            disabled:cursor-not-allowed text-foreground 
            font-medium py-2.5 px-4 rounded-lg transition-colors 
            duration-200"
          >
            <span className='flex items-center justify-center gap-2'>
              {play}Start Quiz
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}