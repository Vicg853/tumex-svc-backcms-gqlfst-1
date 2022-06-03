import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Arg,
   Resolver,
   Mutation,
   Authorized,
   Ctx
} from 'type-graphql'

@Resolver()
export class ObjectiveRemoveResolvers {
   @Authorized('SUDO')
   @Mutation(_type => String, {
      nullable: false,
      description: 'Remove one or many objectives'
   })
   async removeObjectives(
      @Ctx() ctx: ApolloContext,
      @Arg('ids', _type => [String], {
         description: 'Objective\'s(\') ID(s) to remove'
      }) ids: string[]
   ): Promise<string> {
      const prismaRes = await ctx.prisma.objectives.deleteMany({
         where: {
            id: {
               in: ids
            }
         }
      }).then(res => ({
         count: res.count,
         message: null,
         err: null
      })).catch(err => ({
         count: 0,
         message: err.message ?? 'An unknown error occurred while removing objectives',
         err: err.code ?? 'INTERNAL_SERVER_ERROR'
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `${prismaRes.count} objectives removed`
   }
}