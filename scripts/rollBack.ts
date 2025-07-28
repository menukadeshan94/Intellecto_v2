

async function rollbackQuestions() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  
  try {
    console.log("Rolling back questions...");
    
    // Delete all questions with the incorrect quizId
    const deleteResult = await prisma.category.deleteMany({
      where: {
        quizId: "68667250b7e022936f272c02"
      }
    });
    
    console.log(`Deleted ${deleteResult.count} questions`);
    console.log("Rollback completed successfully.");
    
  } catch (error) {
    console.error("Error during rollback:", error);
  } finally {
    await prisma.$disconnect();
  }
}

rollbackQuestions();