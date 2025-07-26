"use client";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "../../../context/globalContext";
import { play } from "../../../utils/icons";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter();
  const { quizResponses, selectedQuiz } = useGlobalContext();

  if (!quizResponses || quizResponses.length === 0) {
    return router.push("/"); // redirect to home page
  }

  // calculate the score
  const correctAnswers = quizResponses.filter(
    (res: { isCorrect: boolean }) => res.isCorrect
  ).length;
  const totalQuestions = quizResponses.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  // Show message for the score
  let message = "";
  let messageColor = "";
  let scoreColor = "";
  let iconEmoji = "";

  if (scorePercentage < 25) {
    message = "You need to try harder!";
    messageColor = "text-destructive";
    scoreColor = "text-destructive";
    iconEmoji = "😔";
  } else if (scorePercentage >= 25 && scorePercentage < 50) {
    message = "You're getting there! Keep practicing.";
    messageColor = "text-muted-foreground";
    scoreColor = "text-muted-foreground";
    iconEmoji = "🤔";
  } else if (scorePercentage >= 50 && scorePercentage < 75) {
    message = "Good effort! You're above average.";
    messageColor = "text-primary";
    scoreColor = "text-primary";
    iconEmoji = "👍";
  } else if (scorePercentage >= 75 && scorePercentage < 100) {
    message = "Great job! You're so close to perfect!";
    messageColor = "text-primary";
    scoreColor = "text-primary";
    iconEmoji = "🎉";
  } else if (scorePercentage === 100) {
    message = "Outstanding! You got everything right!";
    messageColor = "text-primary";
    scoreColor = "text-primary";
    iconEmoji = "🏆";
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary)/0.05),transparent)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-muted/20 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-6xl sm:text-8xl animate-bounce">{iconEmoji}</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Quiz Results
            </h1>
          </div>

          {/* Score Card */}
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-3xl p-6 sm:p-8 shadow-lg mx-auto max-w-2xl">
            {/* Score Display */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <p className="text-lg sm:text-xl text-muted-foreground mb-2">
                  Your Score
                </p>
                <div className={`text-5xl sm:text-6xl lg:text-7xl font-bold ${scoreColor} mb-4`}>
                  {scorePercentage.toFixed(0)}%
                </div>
                
                {/* Progress Circle */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - scorePercentage / 100)}`}
                      className={scoreColor.replace('text-', 'text-')}
                      strokeLinecap="round"
                      style={{
                        transition: 'stroke-dashoffset 2s ease-in-out',
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl sm:text-3xl font-bold ${scoreColor}`}>
                      {correctAnswers}/{totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-primary/10 rounded-2xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="bg-destructive/10 rounded-2xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-destructive">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center pt-4">
                <p className={`text-xl sm:text-2xl font-semibold ${messageColor}`}>
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-muted/20 rounded-full px-6 py-3">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 delay-${i * 100} ${
                      i < Math.ceil(scorePercentage / 20)
                        ? scoreColor.replace('text-', 'bg-')
                        : 'bg-muted/40'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Performance Level
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => router.push("/quiz/setup/" + `${selectedQuiz.id}`)}
            >
              <span className="flex items-center gap-3">
                {play}
                Play Again
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="border-border hover:bg-card px-8 py-4 text-lg font-bold rounded-2xl transform transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => router.push("/")}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </span>
            </Button>
          </div>

          {/* Quiz Info */}
          {selectedQuiz && (
            <div className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-4 mt-8 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">Quiz Completed</p>
              <p className="font-semibold text-foreground">{selectedQuiz.title}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;