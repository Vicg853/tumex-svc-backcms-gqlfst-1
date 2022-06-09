import type { Techs } from '@prisma-gen/type-graphql'
import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Args,
   Authorized,
   Ctx,
   Query,
   Resolver
} from 'type-graphql'

import { QueryFields } from './classes/queryFields'
import { QueryArgs } from './classes/queryArgs'

@Resolver()
export class TechQueryResolver {
   @Query(_type => QueryFields, {
      description: 'Query many technologies with optional filters'
   })
   async getManyTechs(
      @Ctx() ctx: ApolloContext,
      @Args() { filter, /*group*/ includeHidden, onlyHidden }: QueryArgs
   ): Promise<Techs[] | null> {
      const prismaRes = await ctx.prisma.techs.findMany({
         where: {
            ...filter,
            hidden: onlyHidden || (includeHidden ? undefined : false),
         }
      }).then(res => ({
         data: res,
         message: null,
         err: null
      })).catch(err => ({
         data: null,
         message: err.message ?? 'An unknown error occurred while creating new techs',
         err: err.code ?? 'INTERNAL_SERVER_ERROR'
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return prismaRes.data
   }
}