import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
   Args,
   Authorized,
   Ctx,
   Mutation,
   Resolver
} from 'type-graphql'

import {
   CreateTechArgs
} from './classes/createArgs'

@Resolver()
export class CreateResolver {
   //TODO check auth scopes
   @Authorized('SUDO')
   @Mutation(_type => String, {
      description: 'Create a new technologies'
   })
   async createTech(
      @Ctx() ctx: ApolloContext,
      @Args() { data, shared }: CreateTechArgs
   ): Promise<string | null> {
      const prismaRes = await ctx.prisma.techs.createMany({
         data: data.map(tech => ({
            ...tech,
            aproxExpYears: tech.aproxExpYears ?? shared?.aproxExpYears ?? undefined,
            aproxProjUse: tech.aproxProjUse ?? shared?.aproxProjUse ?? undefined,
            listAsSkill: tech.listAsSkill ?? shared?.listAsSkill ?? undefined,
            hidden: tech.hidden ?? shared?.hidden ?? undefined
         }))
      }).then(res => ({
         count: res.count,
         message: null,
         err: null
      })).catch(err => ({
         count: 0,
         message: err.message ?? 'An unknown error occurred while creating new techs',
         err: err.code ?? 'INTERNAL_SERVER_ERROR'
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `${prismaRes.count} techs created successfully!`
   }
}

