import type { ApolloContext } from '~/index'

import {
   Resolver,
   Mutation,
   Args,
   Ctx
} from 'type-graphql'
import { ApolloError } from 'apollo-server-core'


import { Scopes } from '@config/jwt-tkn'
import { AuthMiddle } from '@middlewares/auth'
import { 
   ObjectiveBulkModArgs,
   ObjectiveModInput,
   ManyObjectivesModArgs
} from './classes/modArgs'
import {
   ObjectiveQueryFields
} from './classes/queryFields'

@Resolver()
export class ObjectiveModResolver {
   @AuthMiddle({
      scopes: [Scopes.objectivesEdit]
   })
   @Mutation(() => ObjectiveQueryFields, {
      description: 'Update an objective',
      nullable: false,
   })
   async modObjective(
      @Ctx() ctx: ApolloContext,
      @Args() { id, ...data }: ObjectiveModInput
   ): Promise<ObjectiveQueryFields | null> {
      const prismaRes = await ctx.prisma.objectives.update({
         where: { id },
         data: {
            ...data,
            ...(data.title && {title: { update: data.title }}),
            ...(data.description && {description: { update: data.description }}),
         }
      }).then(data => ({
         data,
         err: null,
         message: null
      })).catch(error => ({
         data: null,
         err: error.code,
         message: error.message
      }))

      if(prismaRes.err !== null)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return prismaRes.data
   }

   @AuthMiddle({
      scopes: [Scopes.objectivesEdit]
   })
   @Mutation(() => String, {
      description: 'Update an objective',
      nullable: false,
   })
   async modObjectiveBulk(
      @Ctx() ctx: ApolloContext,
      @Args() { ids, filter, ...data }: ObjectiveBulkModArgs
   ): Promise<string> {
      if(typeof data.hidden === 'undefined' && typeof data.progress === 'undefined'
         && typeof data.year === 'undefined' && typeof data.source === 'undefined') 
         throw new ApolloError('At least one bulk field must be specified!', '406')

      const prismaRes = await ctx.prisma.objectives.updateMany({
         where: { 
            ...(typeof ids !== 'undefined' ? { id: { in: ids } } : {}), 
            ...filter 
         },
         data
      }).then(data => ({
         count: data.count,
         message: null,
         err: null
      })).catch(err => ({
         count: null,
         message: err.message ?? 'An unknown error occurred while updating objectives opacity',
         err: err.code ?? '500'
      }))

      if(prismaRes.err !== null) 
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return prismaRes.count! > 0 ? `Updated ${prismaRes.count} objective${prismaRes.count! > 1 ? 's' : ''}.` 
         : 'No objectives were updated.'
   }

   @AuthMiddle({
      scopes: [Scopes.objectivesEdit]
   })
   @Mutation(() => [ObjectiveQueryFields], {
      description: 'Update many objectives at once but separately.',
      nullable: false,
   })
   async modManyObjectives(
      @Ctx() ctx: ApolloContext,
      @Args() { shared, data: rawData }: ManyObjectivesModArgs
   ): Promise<ObjectiveQueryFields[] | null> {
      const prismaTransaction = await ctx.prisma.$transaction(rawData.map(({ id, ...rawObjectiveData }) => 
         ctx.prisma.objectives.update({
            where: { id },
            data: {
               ...rawObjectiveData,
               year: rawObjectiveData.year ?? shared?.year,
               progress: rawObjectiveData.progress ?? shared?.progress,
               hidden: rawObjectiveData.hidden ?? shared?.hidden,
               ...(rawObjectiveData.title && {title: { update: rawObjectiveData.title }}),
               ...(rawObjectiveData.description && {description: { update: rawObjectiveData.description }}),
            }
         })
      )).then(data => ({
         data,
         err: null,
         message: null
      })).catch(error => ({
         data: null,
         err: error.code,
         message: error.message
      }))

      if(prismaTransaction.err !== null)
         throw new ApolloError(prismaTransaction.message, prismaTransaction.err)

      return prismaTransaction.data
   }
}