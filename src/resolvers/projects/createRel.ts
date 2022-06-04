import type { ApolloContext } from '~/index'

import { Mutation, Ctx, Args, Resolver } from 'type-graphql'
import { ApolloError } from 'apollo-server-core'

import { ProjectRelationCreate } from './classes/relCreateArgs'

@Resolver()
export class CreateProjectRelationResolver {
   @Mutation(_returns => String, {
      nullable: true,
      description: 'Creates project(s) relation(s)'   
   })
   async createProjectRelation(
      @Ctx() ctx: ApolloContext,
      @Args() { id, asRelateeTo, relatees }: ProjectRelationCreate
   ): Promise<string> {
      if(!asRelateeTo && !relatees) 
         throw new ApolloError('At least one of the arguments "asRelateeTo" or "relatees" must be provided', '406')

      if(asRelateeTo && relatees)
         throw new ApolloError('Only one of aProjectToRelatees and aRelateeToProjects can be set', '406')
      
      if(asRelateeTo && asRelateeTo.includes(id))
         throw new ApolloError('Project cannot be related to itself')

      if(relatees && relatees.includes(id))
         throw new ApolloError('Project cannot be related to itself')

      const prismaRes = await ctx.prisma.projectRelation.createMany({
         data: [
            ...(asRelateeTo ? asRelateeTo.map(projectId => ({
               projectId,
               relatedId: id
            })): []),
            ...(relatees ? relatees.map(relatedId => ({
               projectId: id,
               relatedId
            })) : [])
         ]
      }).then(res => ({
         count: res.count,
         message: null,
         err: null
      }))
      .catch(err => ({
         count: 0,
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
         message: err.meta.target ?? 'Project relations query failed with unknown error!',
      }))

      if(prismaRes.err) 
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `Created ${prismaRes.count} project relation(s)`
   }

}