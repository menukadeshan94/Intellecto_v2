"use client";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "../../../context/globalContext";
import { IOption, IQuestion, IResponse } from "../../../types/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

function page() {
  const {
    selectedQuiz,
    quizSetup,
    setQuizSetup,
    setQuizResponses,
  } = useGlobalContext();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [activeQuestion, setActiveQuestion] = React.useState(null) as any;
  const [responses, setResponses] = React.useState<IResponse[]>([]);
  const [shuffledOptions, setShuffledOptions] = React.useState<IOption[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = React.useState<IQuestion[]>(
    []
  );

  if (!selectedQuiz) {
    router.push("/");
    return null;
  }

  // shuffle questions when the quiz is started
  useEffect(() => {
    console.log("useEffect running - quizSetup:", quizSetup);
    
    const filteredQuestions = selectedQuiz.questions.filter((q:{difficulty: string})=>{
      // If no difficulty is set, or difficulty is "unspecified", include all questions
      if (!quizSetup?.difficulty || quizSetup?.difficulty === "unspecified") {
        return true;
      }
      // If difficulty is set, match it (handle null values)
      return q.difficulty === quizSetup?.difficulty;
    }).slice(0, quizSetup?.questionsCount || 1); // Default to 1 if questionCount is undefined

    console.log("Filtered questions:", filteredQuestions);
    console.log("Quiz setup:", quizSetup);

    setShuffledQuestions(shuffleArray([...filteredQuestions]));
  }, [selectedQuiz, quizSetup]);

  // shuffle options when the active question changes
  useEffect(() => {
    if (shuffledQuestions[currentIndex]) {
      // shuffle options for the current question
      setShuffledOptions(
        shuffleArray([...shuffledQuestions[currentIndex].options])
      );
    }
  }, [shuffledQuestions, currentIndex]);

  // Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; --i) {
      // generate a random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));

      // swap elements --> destructuring assignment
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const handleActiveQuestion = (option: any) => {
    if (!shuffledQuestions[currentIndex]) return;

    const response = {
      questionId: shuffledQuestions[currentIndex].id,
      optionId: option.id,
      isCorrect: option.isCorrect,
    };  

    setResponses((prev) => {
      // check if the response already exists
      const existingIndex = prev.findIndex((res) => {
        return res.questionId === response.questionId;
      });

      // update the response if it exists

      if (existingIndex !== -1) {
        // update the response
        const updatedResponses = [...prev];
        updatedResponses[existingIndex] = response;

        return updatedResponses;
      } else {
        return [...prev, response];
      }
    });

    // set the active question
    setActiveQuestion(option);
  };

  const handleNextQuestion = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);

      // reset the active question
      setActiveQuestion(null);
    } else {
      router.push("/quiz/results");
    }
  };

  const handleFinishQuiz = async () => {
    setQuizResponses(responses);

    const correctAnswers = responses.filter((res) => res.isCorrect).length;
    const score = Math.round((correctAnswers / responses.length) * 100);

    try {
      const res = await axios.post("/api/user/quiz/finish", {
        categoryId: selectedQuiz.categoryId,
        quizId: selectedQuiz.id,
        score,
        responses,
      });

      console.log("Quiz finished:", res.data);
    } catch (error) {
      console.log("Error finishing quiz:", error);
    }

    setQuizSetup({
      questionsCount: 1,
      category: null,
      difficulty: null,
    });

    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary)/0.05),transparent)]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {shuffledQuestions[currentIndex] ? (
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
                {shuffledQuestions[currentIndex].text}
              </h1>
            </div>

            {/* Options */}
            <div className="space-y-3 sm:space-y-4 mt-8 sm:mt-12 mb-40 sm:mb-32">
              {shuffledOptions.map((option, index) => (
                <button
                  key={index}
                  className={`group relative w-full p-4 sm:p-6 text-left border-2 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium transition-all duration-300 ease-out transform active:scale-95 sm:hover:scale-[1.02] sm:hover:-translate-y-1
                    ${
                      option.text === activeQuestion?.text
                        ? "bg-accent/20 border-primary shadow-lg shadow-primary/25 text-foreground"
                        : "bg-card/40 backdrop-blur-sm border-border text-muted-foreground active:bg-card/60 sm:hover:bg-card/60 sm:hover:border-primary/50 sm:hover:text-foreground"
                    }
                  `}
                  onClick={() => handleActiveQuestion(option as IOption)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300
                      ${
                        option.text === activeQuestion?.text
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-sm sm:text-base leading-relaxed">{option.text}</span>
                    {option.text === activeQuestion?.text && (
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

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 sm:p-6 safe-area-pb">
          <div className="max-w-4xl mx-auto">
            <button
              className={`w-full min-h-[48px] sm:min-h-[56px] px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 sm:hover:scale-105 sm:hover:shadow-lg
                ${
                  activeQuestion?.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:bg-primary/90 sm:hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
              disabled={!activeQuestion?.id}
              onClick={() => {
                // Double check to prevent any potential issues
                if (!activeQuestion?.id) {
                  const sound = new Audio("/sounds/error.mp3");
                  sound.play();
                  toast.error("Please select an option to continue");
                  return;
                }

                if (currentIndex < shuffledQuestions.length - 1) {
                  handleNextQuestion();
                } else {
                  handleFinishQuiz();
                }
              }}
            >
              {currentIndex < shuffledQuestions.length - 1 ? (
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
            
            {/* Progress Indicator */}
            <div className="mt-3 sm:mt-4">
              <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                <div 
                  className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex) / shuffledQuestions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(((currentIndex) / shuffledQuestions.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;