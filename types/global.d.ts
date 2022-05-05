import type { PrismaClient } from '@prisma/client'

export declare global {
   type prismaClient = typeof PrismaClient | undefined
}
 