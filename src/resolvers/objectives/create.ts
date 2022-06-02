import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Args,
   Resolver,
   Mutation,
   Authorized,
   Ctx
} from 'type-graphql'

import {
   CreateObjectiveArgs
} from './classes/createArgs'

@Resolver()
export class ObjectiveCreationResolvers {
   @Authorized('is:tumex')
   @Mutation(_returns => Number, {
      nullable: false,
      description: 'Create a new objective.'
   })
   async createObjective(
      @Ctx() ctx: ApolloContext,
      @Args() { input, globalInput }: CreateObjectiveArgs
   ): Promise<number> {
      let missingInput: string = ''
      const inputCheck = input.some(i => {
         if ((!globalInput || !globalInput.progress) && !i.progress) 
            return missingInput = 'progress'
         if ((!globalInput || !globalInput.source) && !i.source) 
            return missingInput = 'source'
         if ((!globalInput || !globalInput.year) && !i.year) 
            return missingInput = 'year'
      })

      if(!!inputCheck)
         throw new ApolloError(`You must either define a Global value for ${missingInput} or provide each objective with a ${missingInput}.`, '406')
      
      const prismaRes = await ctx.prisma.objectives.createMany({
         data: input.map(objective => ({
            title: objective.title,
            description: objective.description,
            progress: objective.progress ?? globalInput!.progress!,
            source: objective.source ?? globalInput!.source!,
            year: objective.year ?? globalInput!.year!,
            hidden: typeof objective.hidden !== 'undefined' ? objective.hidden : 
               (typeof globalInput !== 'undefined' && typeof globalInput.hidden !== 'undefined') 
               ? globalInput.hidden : undefined,
         }))
      }).then(res => ({
         count: res.count,
         message: null,
         err: null
      })).catch(res => ({
         count: 0,
         message: res.message ?? 'An unknown error occurred while creating objectives.',
         err: res.err ?? 'INTERNAL_SERVER_ERROR'
      }))
      
      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)
      
      return prismaRes.count
   }
}