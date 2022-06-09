import type { Techs } from '@prisma-gen/type-graphql'
import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Args,
   Ctx,
   Query,
   Resolver
} from 'type-graphql'

import { QueryFields } from './classes/queryFields'
import { QueryManyArgs, QueryOnlyArgs } from './classes/queryArgs'

@Resolver()
export class TechQueryResolver {
   @Query(_type => QueryFields, {
      description: 'Query many technologies with optional filters'
   })
   async getManyTechs(
      @Ctx() ctx: ApolloContext,
      @Args() { filter, /*group*/ includeHidden, onlyHidden }: QueryManyArgs
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

   @Query(_type => QueryFields, {
      description: 'Query a specific tech by its ID or name'
   })
   async getTech(
      @Ctx() ctx: ApolloContext,
      @Args() { id, name, includeHidden, onlyHidden }: QueryOnlyArgs
   ): Promise<Techs | null> {
      if(!id && !name)
         throw new ApolloError('You must provide either an ID or a name to query a tech', '406')

      const prismaRes = await ctx.prisma.techs.findUnique({
         where: {
            ...(id ? { id } : {}),
            ...(name ? { name } : {}),
         },
         rejectOnNotFound: false
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

      if(!prismaRes.data)
         return null

      return onlyHidden ? prismaRes.data : 
         ((!prismaRes.data.hidden || includeHidden) ? 
         prismaRes.data : null)
   }
}