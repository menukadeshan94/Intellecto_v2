import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../utils/connect";

export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { categoryId, quizId, score, responses } = await req.json();

        // Validate the fields
        if (!categoryId || !quizId || typeof score !== 'number' || score < 0 || score > 100 || !Array.isArray(responses)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({ 
            where: { clerkId } 
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find existing category stat
        let stat = await prisma.categoryStat.findUnique({
            where: {
                userId_categoryId: {
                    userId: user.id,
                    categoryId,
                }
            }
        });

        if (stat) {
            // Update existing stat
            const newCompleted = stat.completed + 1;
            const newAttempts = stat.attempts + 1;
            const currentAverage = stat.averageScore || 0;
            const newAverageScore = (currentAverage * stat.completed + score) / newCompleted;
            const newBestScore = Math.max(stat.bestScore || 0, score);

            stat = await prisma.categoryStat.update({
                where: { id: stat.id },
                data: {
                    completed: newCompleted,
                    attempts: newAttempts,
                    averageScore: newAverageScore,
                    bestScore: newBestScore,  // ✅ This should work now!
                    lastAttempt: new Date(),
                    // updatedAt is automatically handled by Prisma
                }
            });
        } else {
            // Create new stat
            stat = await prisma.categoryStat.create({
                data: {
                    userId: user.id,
                    categoryId,
                    attempts: 1,
                    completed: 1,
                    averageScore: score,
                    bestScore: score,
                    totalTime: 0,
                    lastAttempt: new Date(),
                    // createdAt and updatedAt are automatically set by Prisma
                }
            });
        }

        // Create quiz attempt record for detailed tracking
        const quizAttempt = await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizId,
                categoryId,
                score,
                totalQuestions: responses.length,
                correctAnswers: responses.filter((r: any) => r.isCorrect).length,
                completed: true,
                answers: responses,
                completedAt: new Date(),
                // startedAt, createdAt, updatedAt are automatically handled
            }
        });

        // Return the updated stat with related data
        const statWithRelations = await prisma.categoryStat.findUnique({
            where: { id: stat.id },
            include: {
                user: {
                    select: {
                        id: true,
                        clerkId: true,
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return NextResponse.json({
            stat: statWithRelations,
            attempt: quizAttempt,
            message: "Quiz completed successfully"
        });

    } catch (error) {
        console.error("Error finishing quiz:", error);
        return NextResponse.json(
            { error: "Failed to save quiz results" }, 
            { status: 500 }
        );
    }
}