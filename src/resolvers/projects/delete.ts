import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import { Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import { 
   DelProjectsArgs,
   DelProjectsRelArgs
} from './classes/delArgs'

@Resolver()
export class DeleteProjectsResolver {
   //TODO: Revise auth scopes
   @Authorized('SUDO')
   @Mutation(_returns => String, {
      nullable: true,
      description: 'Deletes a/many project(s)'
   })
   async deleteProjects(
      @Ctx() ctx: ApolloContext,
      @Args() { ids }: DelProjectsArgs,
   ): Promise<string | null> {
      const prismaRes = await ctx.prisma.project.deleteMany({
         where: {
            id: {
               in: ids
            }
         }
      }).then(res => ({
         count: res.count,
         err: null,
         message: null,
      }))
      .catch(err => ({
         count: 0,
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
         message: err.meta.target ?? 'Project delete failed with unknown error!',
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `Deleted ${prismaRes.count} project(s)`
   }
   
   @Authorized('SUDO')
   @Mutation(_returns => String, {
      nullable: true,
      description: 'Deletes project to project relations for the given project id.'
   })
   async deleteProjectRelations(
      @Ctx() ctx: ApolloContext,
      @Args() { 
         id, allRelated, relatedIds, 
         allRelatee, relateeLinks
      }: DelProjectsRelArgs,
   ): Promise<string | null> {
      const considerRelatee = !!allRelatee || !!relateeLinks
      const considerRelated = !!allRelated || !!relatedIds

      if(!considerRelatee && !considerRelated)
         throw new ApolloError('No relations to delete!', '406')

      const prismaRes = await ctx.prisma.projectRelation.deleteMany({
         where: {
            OR: [
               {...(considerRelatee && {
                  ...(!!allRelatee && { relatedId: { equals: id } }),
                  ...(!allRelatee && {
                     AND: [
                        { relatedId: { equals: id } },
                        { projectId: { in: relateeLinks } }
                     ]
                  }),
               })},
               {...(considerRelated && {
                  ...(!!allRelated && { projectId: { equals: id } }),
                  ...(!allRelated && {
                     AND: [
                        { projectId: { equals: id } },
                        { relatedId: { in: relatedIds } }
                     ]
                  }),
               })}
            ]
         }
      }).then(res => ({
         count: res.count,
         err: null,
         message: null,
      }))
      .catch(err => ({
         count: 0,
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
         message: err.meta.target ?? 'Project relation delete failed with unknown error!',
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `Deleted ${prismaRes.count} project relation(s)`
   }
}