import type {
   ApolloContext
} from '~/index'

import {
   Resolver,
   Query,
   Ctx,
   ObjectType,
} from 'type-graphql'

import { 
   Objectives,
} from '@prisma-gen/type-graphql'

@ObjectType({ simpleResolvers: true })
@Resolver(of => Objectives)
export class ObjectivesResolver {
   @Query(returns => [Objectives], { nullable: true })
   async getAllObjectives(@Ctx() { prisma }: ApolloContext): Promise<Objectives[] | null> {
      return await prisma.objectives.findMany()
   }

}