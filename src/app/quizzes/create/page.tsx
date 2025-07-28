// /app/quizzes/create/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import  prisma  from "../../../../utils/connect"; // Adjust path to your Prisma client
import QuizCreateForm from "./QuizCreateForm";

// Import your proper interfaces
import { ICategoryForForm } from "../../../../types/types"; // More specific type for form

// Server component to fetch categories and check admin status
export default async function CreateQuizPage() {
  // Check authentication and admin role
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in"); // Redirect to Clerk's sign-in page if not authenticated
  }

  const user = await currentUser();
  if (user?.publicMetadata.role !== "admin") {
    redirect("/403"); // Redirect non-admins to custom Forbidden page
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

  // Fetch active categories from Prisma (minimal data for form dropdown)
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
      
  console.log("object", categories);
  // Transform to ICategoryForForm structure (optimized for form dropdown)
  const formattedCategories: ICategoryForForm[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || '',
    image: category.image || undefined,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create a New Quiz
        </h1>
        {/* Pass categories and user info to client component */}
        <QuizCreateForm categories={formattedCategories} creatorId={dbUser.id} />
      </div>
    </div>
  );
}