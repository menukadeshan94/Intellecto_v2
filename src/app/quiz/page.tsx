"use client";
import { useGlobalContext } from "../../../context/globalContext";
import { IOption, IQuestion, IResponse } from "../../../types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

function Page() {
  const {
    selectedQuiz,
    quizSetup,
    setQuizSetup,
    setQuizResponses,
  } = useGlobalContext();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [activeQuestion, setActiveQuestion] = React.useState<IOption | null>(null);
  const [responses, setResponses] = React.useState<IResponse[]>([]);
  const [shuffledOptions, setShuffledOptions] = React.useState<IOption[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = React.useState<IQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Memoize shuffle function
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Memoize filtered questions
  const filteredQuestions = useMemo(() => {
    if (!selectedQuiz) return [];
    
    return selectedQuiz.questions
      .filter((q: { difficulty: string }) => {
        if (!quizSetup?.difficulty || quizSetup?.difficulty === "unspecified") {
          return true;
        }
        return q.difficulty === quizSetup?.difficulty;
      })
      .slice(0, quizSetup?.questionsCount || 1);
  }, [selectedQuiz, quizSetup]);

  // FIXED: Better progress calculation
  const progress = useMemo(() => {
    if (shuffledQuestions.length === 0) return 0;
    
    // Calculate progress based on completed questions
    let completedQuestions = 0;
    
    // Count questions that have been answered
    for (let i = 0; i <= currentIndex; i++) {
      const questionId = shuffledQuestions[i]?.id;
      if (questionId && responses.some(r => r.questionId === questionId)) {
        completedQuestions++;
      }
    }
    
    // If current question is selected but not yet submitted, don't count it as complete
    const progressPercent = (completedQuestions / shuffledQuestions.length) * 100;
    return Math.min(Math.round(progressPercent), 100);
  }, [shuffledQuestions, currentIndex, responses]);

  // Handle redirect if no quiz is selected
  useEffect(() => {
    if (!selectedQuiz) {
      router.push("/");
    }
  }, [selectedQuiz, router]);

  // Shuffle questions when the quiz is started
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setShuffledQuestions(shuffleArray(filteredQuestions));
    }
  }, [filteredQuestions, shuffleArray]);

  // Shuffle options when the active question changes
  useEffect(() => {
    const currentQuestion = shuffledQuestions[currentIndex];
    if (currentQuestion) {
      setShuffledOptions(shuffleArray([...currentQuestion.options]));
      // Reset active question, but check if this question was already answered
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      if (existingResponse) {
        // Find the previously selected option
        const previousOption = currentQuestion.options.find(opt => opt.id === existingResponse.optionId);
        setActiveQuestion(previousOption || null);
      } else {
        setActiveQuestion(null);
      }
    }
  }, [shuffledQuestions, currentIndex, shuffleArray, responses]);

  const playErrorSound = useCallback(() => {
    try {
      const sound = new Audio("/sounds/error.mp3");
      sound.volume = 0.5;
      sound.play().catch(err => {
        console.warn("Could not play error sound:", err);
      });
    } catch (err) {
      console.warn("Error sound file not found:", err);
    }
  }, []);

  const handleActiveQuestion = useCallback((option: IOption) => {
    const currentQuestion = shuffledQuestions[currentIndex];
    if (!currentQuestion) return;

    const response: IResponse = {
      questionId: currentQuestion.id,
      optionId: option.id,
      isCorrect: option.isCorrect,
    };

    setResponses((prev) => {
      const existingIndex = prev.findIndex((res) => 
        res.questionId === response.questionId
      );

      if (existingIndex !== -1) {
        const updatedResponses = [...prev];
        updatedResponses[existingIndex] = response;
        return updatedResponses;
      }
      return [...prev, response];
    });

    setActiveQuestion(option);
  }, [shuffledQuestions, currentIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  }, [currentIndex, shuffledQuestions.length]);

  const handleFinishQuiz = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setQuizResponses(responses);

    const correctAnswers = responses.filter((res) => res.isCorrect).length;
    const score = Math.round((correctAnswers / responses.length) * 100);

    try {
      await axios.post("/api/user/quiz/finish", {
        categoryId: selectedQuiz?.categoryId,
        quizId: selectedQuiz?.id,
        score,
        responses,
      });

      setQuizSetup({
        questionsCount: 1,
        category: null,
        difficulty: null,
      });

      router.push("/results");
    } catch (error) {
      console.error("Error finishing quiz:", error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Failed to save quiz results"
        : "An unexpected error occurred";
      
      toast.error(`${errorMessage}. Please try again.`);
      setIsSubmitting(false);
    }
  }, [isSubmitting, responses, setQuizResponses, selectedQuiz, setQuizSetup, router]);

  const handleButtonClick = useCallback(() => {
    if (!activeQuestion?.id) {
      playErrorSound();
      toast.error("Please select an option to continue");
      return;
    }

    if (currentIndex < shuffledQuestions.length - 1) {
      handleNextQuestion();
    } else {
      handleFinishQuiz();
    }
  }, [activeQuestion?.id, currentIndex, shuffledQuestions.length, playErrorSound, handleNextQuestion, handleFinishQuiz]);

  if (!selectedQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center border border-border animate-pulse">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <p className="text-xl text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary)/0.05),transparent)]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {currentQuestion ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Question Counter */}
            <div className="flex justify-end">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                <span className="text-muted-foreground text-sm sm:text-lg">Question: </span>
                <span className="text-foreground font-bold text-lg sm:text-xl">{currentIndex + 1}</span>
                <span className="text-muted-foreground mx-1 sm:mx-2">/</span>
                <span className="text-xl sm:text-2xl font-bold text-primary">{shuffledQuestions.length}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-center space-y-4 sm:space-y-6 px-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
                {currentQuestion.text}
              </h1>
            </div>

            {/* Options */}
            <div className="space-y-3 sm:space-y-4 mt-8 sm:mt-12 mb-40 sm:mb-32">
              {shuffledOptions.map((option, index) => (
                <button
                  key={option.id}
                  className={`group relative w-full p-4 sm:p-6 text-left border-2 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 ease-out transform active:scale-95 sm:hover:scale-[1.02] sm:hover:-translate-y-1
                    ${
                      activeQuestion?.id === option.id
                        ? "bg-accent/20 border-primary shadow-lg shadow-primary/25 text-foreground"
                        : "bg-card/40 backdrop-blur-sm border-border text-muted-foreground active:bg-card/60 sm:hover:bg-card/60 sm:hover:border-primary/50 sm:hover:text-foreground"
                    }
                  `}
                  onClick={() => handleActiveQuestion(option)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300
                      ${
                        activeQuestion?.id === option.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm sm:text-base leading-relaxed">{option.text}</span>
                    {activeQuestion?.id === option.id && (
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-primary">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-card rounded-full flex items-center justify-center border border-border">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.084-2.332l.414-.594m0 0L6.293 12l.037-.037m0 0l.5-.5c.001 0 .002 0 .003-.001a.999.999 0 011.414 0l.037.037M18.5 9.5l.5-.5" />
                </svg>
              </div>
              <p className="text-xl text-muted-foreground">No questions found for this quiz</p>
            </div>
          </div>
        )}

        {/* Fixed Bottom Navigation - ONLY SHOW IF QUESTIONS EXIST */}
        {shuffledQuestions.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 sm:p-6 safe-area-pb">
            <div className="max-w-4xl mx-auto">
              <button
                className={`w-full min-h-[48px] sm:min-h-[56px] px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 sm:hover:scale-105 sm:hover:shadow-lg
                  ${
                    activeQuestion?.id && !isSubmitting
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:bg-primary/90 sm:hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
                disabled={!activeQuestion?.id || isSubmitting}
                onClick={handleButtonClick}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : currentIndex < shuffledQuestions.length - 1 ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <span>Next Question</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Finish Quiz</span>
                  </span>
                )}
              </button>
              
              {/* FIXED Progress Indicator */}
              <div className="mt-3 sm:mt-4">
                <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;