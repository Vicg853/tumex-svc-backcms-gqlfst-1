import type { PrismaClient as PrismaClientType, Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClientType;

const config: Prisma.PrismaClientOptions = {
   log: process.env.NODE_ENV === 'development' ? 
      ['query', 'info', 'warn', 'error'] : 
      ['info', 'warn', 'error'],
}

function getPrisma() {
   {/* @ts-ignore */}
   if (!globalThis.prismaClient) {
      const prisma = new PrismaClient(config)
      
      {/* @ts-ignore */}
      globalThis.prismaClient = prisma
      return prisma
   }
   {/* @ts-ignore */}
   return globalThis.prismaClient
}

prisma = getPrisma()

export { prisma }
