import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import Fields from 'graphql-fields'
import { Args, Ctx, Info, Mutation, Resolver } from 'type-graphql'

import {
   ProjectResult
} from './classes/queryFields'
import { 
   ModProjectArgs, 
   ModProjectData 
} from './classes/modArgs'

@Resolver()
export class ModifyProjectsResolver {
   @Mutation(_returns => ProjectResult, {
      nullable: true,
      description: "Modify a project"
   })
   async modProject(
      @Ctx() ctx: ApolloContext,
      @Args() { id, data, opacityUpdate }: ModProjectArgs,
   ) {
      if(!data && !opacityUpdate) {
         throw new ApolloError('No data or opacity update inputs were provided. At least one of them must be assigned.', '406')
      }
      return null
   }

}