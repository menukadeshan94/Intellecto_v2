import { auth } from "@clerk/nextjs/server";
import React from "react";
import prisma from "../../../utils/connect";
import EnhancedUserStats from "../../../components/userStats/userStat";
import { redirect } from "next/navigation";

export default async function UserStatsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // Get user data with comprehensive stats
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        categoryStats: {
          include: {
            category: {
              include: {
                quizzes: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
          orderBy: {
            lastAttempt: "desc",
          },
        },
      },
    });

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">User Not Found</h1>
            <p className="text-gray-600">Please try logging in again.</p>
          </div>
        </div>
      );
    }

    // Get additional stats
    const additionalStats = await getAdditionalUserStats(user.id);

    const enhancedUserData = {
      ...user,
      additionalStats,
    };

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <EnhancedUserStats userStats={enhancedUserData as any} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-gray-600">Unable to load your statistics. Please try again later.</p>
        </div>
      </div>
    );
  }
}

async function getAdditionalUserStats(userId: string) {
  try {
    const totalCategories = await prisma.category.count();

    const bestCategory = await prisma.categoryStat.findFirst({
      where: {
        userId,
        averageScore: { not: null },
      },
      include: {
        category: true,
      },
      orderBy: {
        averageScore: "desc",
      },
    });

    const recentAttempts = await prisma.categoryStat.findMany({
      where: {
        userId,
        lastAttempt: { not: null },
      },
      select: {
        lastAttempt: true,
      },
      orderBy: {
        lastAttempt: "desc",
      },
      take: 30,
    });

    const currentStreak = calculateStreak(recentAttempts.map((a) => a.lastAttempt!));
    const totalQuizzesAvailable = await prisma.quiz.count();

    return {
      totalCategories,
      bestCategory: bestCategory
        ? {
            category: {
              name: bestCategory.category.name,
            },
            averageScore: bestCategory.averageScore!,
          }
        : null,
      currentStreak,
      totalQuizzesAvailable,
    };
  } catch (error) {
    console.error("Error fetching additional stats:", error);
    return {
      totalCategories: 0,
      bestCategory: null,
      currentStreak: 0,
      totalQuizzesAvailable: 0,
    };
  }
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDates = [...new Set(dates.map((date) => new Date(date).toDateString()))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 1;
  const todayDate = new Date();
  const mostRecentDate = new Date(uniqueDates[0]);
  const diffFromToday = Math.floor((todayDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) return 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffInDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
