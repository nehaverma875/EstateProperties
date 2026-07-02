import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

// Prisma uses the PostgreSQL connection string from .env.
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

// I export one Prisma client and reuse it in all services.
// This keeps database access centralized.
export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});
