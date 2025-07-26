// app/api/user/progress/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../utils/connect";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const progressData = await getProgressData(user.id);

    return NextResponse.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getProgressData(userId: string) {
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

  try {
    // Get weekly progress using MongoDB aggregation
    const weeklyProgress = await getWeeklyProgress(userId, twelveWeeksAgo);

    // Get category progress
    const categoryProgress = await prisma.categoryStat.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        lastAttempt: 'desc'
      }
    });

    // Get monthly trends
    const monthlyTrends = await getMonthlyTrends(userId);

    // Get recent quiz attempts
    const recentAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            title: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return {
      weeklyProgress,
      categoryProgress,
      monthlyTrends,
      recentAttempts
    };

  } catch (error) {
    console.error("Error in getProgressData:", error);
    return {
      weeklyProgress: [],
      categoryProgress: [],
      monthlyTrends: [],
      recentAttempts: []
    };
  }
}

async function getWeeklyProgress(userId: string, startDate: Date) {
  try {
    // Use MongoDB aggregation pipeline for weekly grouping
    const result = await prisma.$runCommandRaw({
      aggregate: "QuizAttempt",
      pipeline: [
        {
          $match: {
            userId: { $oid: userId },
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              week: { $week: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            attempts: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$completed", true] }, 1, 0]
              }
            },
            averageScore: { $avg: "$score" },
            weekStart: { $min: "$createdAt" }
          }
        },
        {
          $sort: { "weekStart": 1 }
        }
      ],
      cursor: {}
    });

    return result.cursor?.firstBatch || [];
  } catch (error) {
    console.error("Error getting weekly progress:", error);
    // Fallback to simpler query
    return await getWeeklyProgressFallback(userId, startDate);
  }
}

async function getWeeklyProgressFallback(userId: string, startDate: Date) {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        completed: true,
        score: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by week manually
    const weeklyData = new Map();

    attempts.forEach(attempt => {
      const date = new Date(attempt.createdAt);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          week: weekStart,
          attempts: 0,
          completed: 0,
          totalScore: 0,
          scoreCount: 0
        });
      }

      const weekData = weeklyData.get(weekKey);
      weekData.attempts++;
      if (attempt.completed) weekData.completed++;
      if (attempt.score !== null) {
        weekData.totalScore += attempt.score;
        weekData.scoreCount++;
      }
    });

    return Array.from(weeklyData.values()).map(week => ({
      week: week.week,
      attempts: week.attempts,
      completed: week.completed,
      averageScore: week.scoreCount > 0 ? week.totalScore / week.scoreCount : null
    }));
  } catch (error) {
    console.error("Error in fallback weekly progress:", error);
    return [];
  }
}

async function getMonthlyTrends(userId: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  try {
    // Use MongoDB aggregation for monthly trends
    const result = await prisma.$runCommandRaw({
      aggregate: "QuizAttempt",
      pipeline: [
        {
          $match: {
            userId: { $oid: userId },
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            totalAttempts: { $sum: 1 },
            completedAttempts: {
              $sum: {
                $cond: [{ $eq: ["$completed", true] }, 1, 0]
              }
            },
            averageScore: { $avg: "$score" },
            uniqueCategories: { $addToSet: "$categoryId" },
            monthStart: { $min: "$createdAt" }
          }
        },
        {
          $project: {
            _id: 1,
            totalAttempts: 1,
            completedAttempts: 1,
            averageScore: 1,
            uniqueCategories: { $size: "$uniqueCategories" },
            monthStart: 1
          }
        },
        {
          $sort: { "monthStart": 1 }
        }
      ],
      cursor: {}
    });

    return result.cursor?.firstBatch || [];
  } catch (error) {
    console.error("Error getting monthly trends:", error);
    return await getMonthlyTrendsFallback(userId, sixMonthsAgo);
  }
}

async function getMonthlyTrendsFallback(userId: string, startDate: Date) {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        completed: true,
        score: true,
        categoryId: true
      }
    });

    // Group by month manually
    const monthlyData = new Map();

    attempts.forEach(attempt => {
      const date = new Date(attempt.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: new Date(date.getFullYear(), date.getMonth(), 1),
          totalAttempts: 0,
          completedAttempts: 0,
          totalScore: 0,
          scoreCount: 0,
          categories: new Set()
        });
      }

      const monthData = monthlyData.get(monthKey);
      monthData.totalAttempts++;
      if (attempt.completed) monthData.completedAttempts++;
      if (attempt.score !== null) {
        monthData.totalScore += attempt.score;
        monthData.scoreCount++;
      }
      monthData.categories.add(attempt.categoryId);
    });

    return Array.from(monthlyData.values()).map(month => ({
      month: month.month,
      totalAttempts: month.totalAttempts,
      completedAttempts: month.completedAttempts,
      averageScore: month.scoreCount > 0 ? month.totalScore / month.scoreCount : null,
      uniqueCategories: month.categories.size
    }));
  } catch (error) {
    console.error("Error in fallback monthly trends:", error);
    return [];
  }
}

// Helper function to get the start of the week (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}