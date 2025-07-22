const questions = require("../data/biologyQuestions");

let questionsPrisma: any;

async function seedQuestions() {
  const { PrismaClient } = require("@prisma/client");

  questionsPrisma = new PrismaClient();

  console.log("Seeding questions...");

  for (const question of questions) {
    // Find the correct answer from the options
    const correctOption = question.options.find((option: any) => option.isCorrect);
    
    const createdQuestion = await questionsPrisma.question.create({
      data: {
        text: question.text,
        quizId: "68667250b7e022936f272c02",
        answer: correctOption.text,
        difficulty: question.difficulty,
        options: {
          create: question.options,
        },
      },
    });

    console.log(`Created question: ${createdQuestion.text}`);
  }
  console.log("Seeding questions completed.");
}

seedQuestions()
  .catch((e) => {
    console.log("Error seeding questions: ", e);
  })
  .finally(async () => {
    await questionsPrisma.$disconnect();
  });