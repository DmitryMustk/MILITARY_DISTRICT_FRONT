import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const env = process.env.NODE_ENV || 'development';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env === 'production' ? [] : ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
