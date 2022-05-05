import type { Config } from 'apollo-server-core'
import { prisma } from '@lib/prisma-client'

export const context: Config['context'] = () => ({ prisma })