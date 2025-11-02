"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import Loader from "../../components/ui/Loader";
import Image from "next/image";
import { formatTime } from "../../utils/formatTime";
import { 
  checkAbc, 
  crosshairs, 
  trophy, 
  calendar, 
  trendingUp, 
  target,
  bookOpen,
  award,
  flame
} from "../../utils/icons";
import CategoryBarChart from "../../components/ui/CategoryBarChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ICategoryStats } from "../../types/types";

interface EnhancedUserStatsProps {
  userStats: {
    id: string;
    clerkId: string | null;
    role: string;
    categoryStats: ICategoryStats[];
    additionalStats: {
      totalCategories: number;
      bestCategory: {
        category: {
          name: string;
        };
        averageScore: number;
      } | null;
      currentStreak: number;
      totalQuizzesAvailable: number;
    };
  };
}

function EnhancedUserStats({ userStats }: EnhancedUserStatsProps) {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

  if (!isLoaded) {
    return <Loader />;
  }

  // Calculate comprehensive stats with proper error handling
  const recentAttemptDate = userStats?.categoryStats.reduce(
    (acc: Date, curr) => {
      // Check if lastAttempt exists and convert string to Date
      if (!curr.lastAttempt) return acc;
      const currentDate = new Date(curr.lastAttempt);
      return currentDate > acc ? currentDate : acc;
    },
    new Date(0)
  );

  const totalAttempts = userStats?.categoryStats.reduce(
    (acc: number, curr) => acc + curr.attempts,
    0
  ) || 0;

  const totalCompleted = userStats?.categoryStats.reduce(
    (acc: number, curr) => acc + curr.completed,
    0
  ) || 0;

  // Fix potential division by zero
  const validScores = userStats?.categoryStats.filter(stat => stat.averageScore !== null) || [];
  const overallAverageScore = validScores.length > 0 
    ? validScores.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / validScores.length
    : 0;

  const completionRate = totalAttempts > 0 ? (totalCompleted / totalAttempts) * 100 : 0;

  const categoriesEngaged = userStats?.categoryStats.filter(stat => stat.attempts > 0).length || 0;

  // Get top 4 categories for overview charts
  const topCategories = userStats?.categoryStats
    .filter(stat => stat.attempts > 0)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 4);

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { 
      text: "Excellent", 
      color: "text-green-600 dark:text-green-400", 
      bg: "bg-green-100 dark:bg-green-900/30" 
    };
    if (score >= 75) return { 
      text: "Good", 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-900/30" 
    };
    if (score >= 60) return { 
      text: "Average", 
      color: "text-yellow-600 dark:text-yellow-400", 
      bg: "bg-yellow-100 dark:bg-yellow-900/30" 
    };
    return { 
      text: "Needs Improvement", 
      color: "text-red-600 dark:text-red-400", 
      bg: "bg-red-100 dark:bg-red-900/30" 
    };
  };

  const performanceBadge = getPerformanceBadge(overallAverageScore);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border-2 border-border shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={user?.imageUrl || "/user.png"}
              alt="Profile Image"
              width={120}
              height={120}
              className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full p-2">
              {trophy}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-3xl text-foreground mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mb-4">
              Here's your learning journey so far
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className={`px-3 py-1 rounded-full ${performanceBadge.bg}`}>
                <span className={`font-semibold ${performanceBadge.color}`}>
                  {performanceBadge.text}
                </span>
              </div>
              <div className="text-muted-foreground">
                Last active: {formatTime(recentAttemptDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'detailed'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Detailed Stats
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={crosshairs}
              title="Total Attempts"
              value={totalAttempts.toString()}
              color="text-blue-500 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-950/30"
            />
            <MetricCard
              icon={checkAbc}
              title="Completed"
              value={totalCompleted.toString()}
              color="text-green-500 dark:text-green-400"
              bgColor="bg-green-50 dark:bg-green-950/30"
            />
            <MetricCard
              icon={target}
              title="Completion Rate"
              value={`${completionRate.toFixed(1)}%`}
              color="text-purple-500 dark:text-purple-400"
              bgColor="bg-purple-50 dark:bg-purple-950/30"
            />
            <MetricCard
              icon={flame}
              title="Current Streak"
              value={`${userStats.additionalStats.currentStreak} days`}
              color="text-orange-500 dark:text-orange-400"
              bgColor="bg-orange-50 dark:bg-orange-950/30"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={award}
              title="Average Score"
              value={overallAverageScore > 0 ? `${overallAverageScore.toFixed(1)}%` : "N/A"}
              color="text-indigo-500 dark:text-indigo-400"
              bgColor="bg-indigo-50 dark:bg-indigo-950/30"
            />
            <MetricCard
              icon={bookOpen}
              title="Categories Engaged"
              value={`${categoriesEngaged}/${userStats.additionalStats.totalCategories}`}
              color="text-teal-500 dark:text-teal-400"
              bgColor="bg-teal-50 dark:bg-teal-950/30"
            />
            <MetricCard
              icon={trendingUp}
              title="Best Category"
              value={userStats.additionalStats.bestCategory?.category.name || "N/A"}
              color="text-rose-500 dark:text-rose-400"
              bgColor="bg-rose-50 dark:bg-rose-950/30"
              subtitle={userStats.additionalStats.bestCategory 
                ? `${userStats.additionalStats.bestCategory.averageScore.toFixed(1)}%`
                : undefined
              }
            />
            <MetricCard
              icon={calendar}
              title="Available Quizzes"
              value={userStats.additionalStats.totalQuizzesAvailable.toString()}
              color="text-amber-500 dark:text-amber-400"
              bgColor="bg-amber-50 dark:bg-amber-950/30"
            />
          </div>

          {/* Category Performance Charts */}
          {topCategories && topCategories.length > 0 && (
            <>
              <div className="mt-6">
                <h2 className="font-bold text-2xl mb-2 text-foreground">Category Performance</h2>
                <p className="text-muted-foreground mb-4">
                  Your most active categories and their performance
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topCategories.map((category) => (
                  <CategoryBarChart key={category.id} categoryData={category} />
                ))}
              </div>
            </>
          )}

          {/* Quick Stats Cards */}
          {userStats.categoryStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-card border-2 border-border p-4 rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)]">
                <h3 className="font-semibold text-card-foreground mb-2">Recent Activity</h3>
                <div className="space-y-2">
                  {userStats.categoryStats
                    .filter(stat => stat.lastAttempt)
                    .sort((a, b) => new Date(b.lastAttempt!).getTime() - new Date(a.lastAttempt!).getTime())
                    .slice(0, 3)
                    .map((stat) => (
                      <div key={stat.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{stat.category?.name}</span>
                        <span className="text-muted-foreground">{formatTime(new Date(stat.lastAttempt!))}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-card border-2 border-border p-4 rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)]">
                <h3 className="font-semibold text-card-foreground mb-2">Top Performers</h3>
                <div className="space-y-2">
                  {userStats.categoryStats
                    .filter(stat => stat.averageScore !== null)
                    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                    .slice(0, 3)
                    .map((stat) => (
                      <div key={stat.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{stat.category?.name}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {stat.averageScore!.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-card border-2 border-border p-4 rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)]">
                <h3 className="font-semibold text-card-foreground mb-2">Progress Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions</span>
                    <span className="font-semibold text-foreground">{totalAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categories Active</span>
                    <span className="font-semibold text-foreground">{categoriesEngaged}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'detailed' && (
        <>
          <div className="mt-4">
            <h2 className="font-bold text-2xl mb-2 text-foreground">Detailed Category Statistics</h2>
            <p className="text-muted-foreground mb-4">
              Complete breakdown of your performance across all categories
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)] overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="py-4 font-semibold text-foreground">Category</TableHead>
                  <TableHead className="font-semibold text-foreground">Attempts</TableHead>
                  <TableHead className="font-semibold text-foreground">Completed</TableHead>
                  <TableHead className="font-semibold text-foreground">Completion Rate</TableHead>
                  <TableHead className="font-semibold text-foreground">Average Score</TableHead>
                  <TableHead className="font-semibold text-foreground">Available Quizzes</TableHead>
                  <TableHead className="font-semibold text-foreground">Last Attempt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats?.categoryStats.map((category) => {
                  const successRate = category.attempts > 0 
                    ? (category.completed / category.attempts) * 100 
                    : 0;
                  
                  return (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell className="py-4">
                        <div className="font-semibold text-card-foreground">
                          {category.category?.name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {category.category?.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">{category.attempts}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {category.completed}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          successRate >= 75 ? 'text-green-600 dark:text-green-400' : 
                          successRate >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {successRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {category.averageScore !== null ? (
                          <span className={`font-medium ${
                            category.averageScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                            category.averageScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {category.averageScore.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {category.category?.quizzes?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {category.lastAttempt ? formatTime(new Date(category.lastAttempt)) : 'Never'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function MetricCard({ icon, title, value, color, bgColor, subtitle }: MetricCardProps) {
  return (
    <div className={`p-4 rounded-lg border-2 border-border shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_.3rem_0_0_rgba(255,255,255,0.1)] ${bgColor} bg-opacity-50`}>
      <div className="flex items-start gap-3">
        <div className={`text-2xl ${color} mt-1`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnhancedUserStats;