// /app/quizzes/create/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../../utils/connect";
import QuizCreateForm from "./QuizCreateForm";
import { ICategoryForForm } from "../../../../types/types";

// Server component to fetch categories and check admin status
export default async function CreateQuizPage() {
  // Check authentication and admin role
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (user?.publicMetadata.role !== "admin") {
    redirect("/403");
  }

  // Ensure user exists in database (create if doesn't exist)
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        role: user?.publicMetadata.role as string || "user",
      },
    });
  }

  // Fetch active categories from Prisma
  const categories = await prisma.category.findMany({
    include: {
      quizzes: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      }
    }
  });

  console.log("Categories fetched:", categories);

  // Transform to ICategoryForForm structure
  const formattedCategories: ICategoryForForm[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || '',
    image: category.image || undefined,
  }));

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-primary">
                Create New Quiz
              </h1>
              <p className="text-muted-foreground">
                Build engaging quizzes for your students and community
              </p>
            </div>
            
            {/* Admin Badge */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-3 py-1 bg-accent rounded-full">
                <svg 
                  className="w-4 h-4 text-accent-foreground mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span className="text-sm font-medium text-accent-foreground">
                  Admin Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg 
                    className="w-6 h-6 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Categories
                  </p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {formattedCategories.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <svg 
                    className="w-6 h-6 text-chart-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {categories.reduce((total, cat) => 
                      total + cat.quizzes.reduce((quizTotal, quiz) => 
                        quizTotal + quiz.questions.length, 0
                      ), 0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <svg 
                    className="w-6 h-6 text-chart-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Quizzes
                  </p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {categories.reduce((total, cat) => total + cat.quizzes.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg 
                    className="w-6 h-6 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Quiz Creation Form
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details below to create your quiz
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Tips */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex items-start space-x-3">
                  <svg 
                    className="w-5 h-5 text-chart-4 mt-0.5 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      Quick Tips for Better Quizzes
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Choose clear, descriptive titles</li>
                      <li>• Select the most appropriate category</li>
                      <li>• Consider your target audience when creating questions</li>
                      <li>• You can upload questions in bulk using Excel templates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pass categories and user info to client component */}
              <QuizCreateForm categories={formattedCategories} creatorId={dbUser.id} />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg 
                  className="w-5 h-5 text-chart-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="font-semibold text-card-foreground">
                  Bulk Upload
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Save time by uploading multiple questions at once using our Excel template.
              </p>
              <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                Download Template →
              </button>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg 
                  className="w-5 h-5 text-chart-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="font-semibold text-card-foreground">
                  Need Help?
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Check our documentation for detailed guides on creating effective quizzes.
              </p>
              <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}