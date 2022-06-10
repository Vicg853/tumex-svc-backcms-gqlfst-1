import type { Techs } from '@prisma-gen/type-graphql'
import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Args,
   Ctx,
   Query,
   Resolver
} from 'type-graphql'

import { groupTechs } from '@utils/grouping'
import { GroupsTechsFieldsEnum } from './classes/groupingArgs'
import { 
  QueryFields, 
  GroupedQueryFields 
} from './classes/queryFields'
import { 
  QueryManyArgs, 
  QueryOnlyArgs,
  QueryManyGroupedArgs
} from './classes/queryArgs'

@Resolver()
export class TechQueryResolver {
   @Query(_type => [QueryFields], {
      description: 'Query many technologies with optional filters',
      nullable: true
   })
   async getManyTechs(
      @Ctx() ctx: ApolloContext,
      @Args() { filter, includeHidden, onlyHidden }: QueryManyArgs
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

      return prismaRes.data ?? null
   }

   @Query(_type => [GroupedQueryFields], {
      description: 'Query many technologies with optional filters and grouping',
      nullable: true
   })
   async getManyGroupedTechs(
      @Ctx() ctx: ApolloContext,
      @Args() { filter, group, includeHidden, onlyHidden }: QueryManyGroupedArgs
   ): Promise<GroupedQueryFields[] | null> {
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
	
      if(!prismaRes.data)
	return null

      return groupTechs(prismaRes.data, {
	aproxExpYears: group
	  .indexOf(GroupsTechsFieldsEnum.aproxExpYears) >= 0 ? true : false,
	aproxProjUse: group
	  .indexOf(GroupsTechsFieldsEnum.aproxProjUse) >= 0 ? true : false,
      })
   }

   @Query(_type => QueryFields, {
      description: 'Query a specific tech by its ID or name',
      nullable: true
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
