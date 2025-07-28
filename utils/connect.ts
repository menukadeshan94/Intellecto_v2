import { PrismaClient } from '@/generated/prisma';

let prisma: PrismaClient;

declare global {
  var __global_prisma__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.__global_prisma__) {
    globalThis.__global_prisma__ = new PrismaClient();
  }
  prisma = globalThis.__global_prisma__;
}

export default prisma;

// creating a new PrismaClient instance
// and assigning it to the global variable __global_prisma__
// allows you to reuse the same instance across different modules 