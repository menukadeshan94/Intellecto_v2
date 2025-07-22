const { PrismaClient } = require("@prisma/client");

let quizzesPrisma: any;

const quizzes = [
  {
    title: "Computer Science Basics",
    description: "A quiz about fundamental computer science concepts.",
    categoryId: "685d8e66cc1ba2d404ad3394", // Replace with valid ID
  },
  {
    title: "Programming Fundamentals",
    description: "Test your knowledge of basic programming concepts.",
    categoryId: "685d8e66cc1ba2d404ad3393", // Replace with valid ID
  },
  {
    title: "Physics",
    description: "Test your knowledge of physics",
    categoryId: "685d8e67cc1ba2d404ad3399", // Replace with valid ID
  },
  {
    title: "Biology",
    description: "Test your knowledge of biology",
    categoryId: "685d8e67cc1ba2d404ad339a", // Replace with valid ID
  },
  {
    title: "Mathematics",
    description: "Master the language of numbers and patterns.",
    categoryId: "685d8e66cc1ba2d404ad3395", // Replace with valid ID
  },
];

async function seedQuizzes() {
  quizzesPrisma = new PrismaClient();

  console.log("Seeding quizzes...");

  for (const quiz of quizzes) {
    const categoryExists = await quizzesPrisma.category.findUnique({
      where: { id: quiz.categoryId },
    });
    if (!categoryExists) {
      console.error(`Category with ID ${quiz.categoryId} does not exist. Skipping quiz: ${quiz.title}`);
      continue;
    }
    const createdQuiz = await quizzesPrisma.quiz.create({
      data: quiz,
    });
    console.log("Created quiz: ", `${createdQuiz.title}`);
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