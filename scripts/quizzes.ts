const { PrismaClient } = require("@prisma/client");

let quizzesPrisma: any;

const quizzes = [
  {
    title: "Computer Science Basics",
    description: "A quiz about fundamental computer science concepts.",
    categoryId: "688523192a319ebd0f384eba", // Replace with valid ID
    creatorId: "688527a11e1e36237b5e5f2b"   // Add this back after db push
  },
  {
    title: "Programming Fundamentals",
    description: "Test your knowledge of basic programming concepts.",
    categoryId: "688523182a319ebd0f384eb9", // Replace with valid ID
    creatorId: "688527a11e1e36237b5e5f2b"   // Add this back after db push
  },
  {
    title: "Physics",
    description: "Test your knowledge of physics",
    categoryId: "6885231a2a319ebd0f384ebf", // Replace with valid ID
    creatorId: "688527a11e1e36237b5e5f2b"   // Add this back after db push
  },
  {
    title: "Biology",
    description: "Test your knowledge of biology",
    categoryId: "6885231b2a319ebd0f384ec0", // Replace with valid ID
    creatorId: "688527a11e1e36237b5e5f2b"   // Add this back after db push
  },
  {
    title: "Mathematics",
    description: "Master the language of numbers and patterns.",
    categoryId: "688523192a319ebd0f384ebb", // Replace with valid ID
    creatorId: "688527a11e1e36237b5e5f2b"   // Add this back after db push
  },
];

async function seedQuizzes() {
  quizzesPrisma = new PrismaClient();

  console.log("Seeding quizzes...");

  for (const quiz of quizzes) {
    // Check if category exists
    const categoryExists = await quizzesPrisma.category.findUnique({
      where: { id: quiz.categoryId },
    });
    if (!categoryExists) {
      console.error(`Category with ID ${quiz.categoryId} does not exist. Skipping quiz: ${quiz.title}`);
      continue;
    }

    // Check if creator exists
    const creatorExists = await quizzesPrisma.user.findUnique({
      where: { id: quiz.creatorId },
    });
    if (!creatorExists) {
      console.error(`Creator with ID ${quiz.creatorId} does not exist. Skipping quiz: ${quiz.title}`);
      continue;
    }

    try {
      const createdQuiz = await quizzesPrisma.quiz.create({
        data: quiz,
      });
      console.log("Created quiz: ", `${createdQuiz.title}`);
    } catch (error) {
      console.error(`Error creating quiz ${quiz.title}:`, error instanceof Error ? error.message : String(error));
    }
  }

  console.log("Seeding quizzes completed.");
}

seedQuizzes()
  .catch((e) => {
    console.log("Error seeding quizzes: ", e);
  })
  .finally(async () => {
    await quizzesPrisma.$disconnect();
  });