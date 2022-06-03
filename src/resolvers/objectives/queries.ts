import { ApolloError } from 'apollo-server-core';
import { Arg, Resolver, Query, Ctx, Args} from 'type-graphql'

import type { ApolloContext } from '~/index'
import { 
   ObjectiveQueryFields 
} from './classes/queryFields'
import { 
   ManyObjectivesQueryArgs,
   QueryOneObjectiveArgs,
   ObjectivesGroupByFieldEnum
} from './classes/queryArgs'

@Resolver()
export class ObjectivesQueriesResolver {
   @Query(_type => [ObjectiveQueryFields], {
      nullable: true,
      description: 'Get many objectives'
   })
   async getManyObjectives(
      @Ctx() ctx: ApolloContext,
      @Args() { filters }: ManyObjectivesQueryArgs
   ): Promise<ObjectiveQueryFields[] | null> {
      const prismaRes = await ctx.prisma.objectives.findMany({
         where: {
            ...filters,
            ...({includeHidden: undefined}),
            ...({onlyHidden: undefined}),
            hidden: filters?.onlyHidden || (filters?.includeHidden ? undefined : false)
         }
      }).then(res => ({
         data: res,
         message: null,
         err: null
      })).catch(err => ({
         data: null,
         message: err.message ?? 'An unknown error occurred while fetching objectives',
         err: err.code ?? 'INTERNAL_SERVER_ERROR'
      }))

      if(prismaRes.err) 
         throw new ApolloError(prismaRes.message, prismaRes.err)
      
      return prismaRes.data!
   }

   @Query(_type => ObjectiveQueryFields, {
      nullable: true,
      description: 'Get a project by id'
   })
   async getObjective(
      @Ctx() ctx: ApolloContext,
      @Args() { id, includeHidden }: QueryOneObjectiveArgs	
   ): Promise<ObjectiveQueryFields | null> {
      const prismaRes = await ctx.prisma.objectives.findUnique({
         where: {
            id,
         },
         rejectOnNotFound: true,
      }).then(res => ({
         data: res,
         message: null,
         err: null
      })).catch(err => ({
         data: null,
         message: err.message ?? 'An unknown error occurred while fetching objective',
         err: err.code ?? 'INTERNAL_SERVER_ERROR'
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      if(includeHidden !== true && 
         (!prismaRes.data || prismaRes.data.hidden))
         return null

      return prismaRes.data!
   }


}
