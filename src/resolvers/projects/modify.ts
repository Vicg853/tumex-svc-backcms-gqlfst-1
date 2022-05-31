import type { ApolloContext } from '~/index'
import type {
   Prisma
} from '@prisma/client'

import { ApolloError } from 'apollo-server-core'
import { Arg, Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import {
   ProjectResult,
   ProjectResultAndRels
} from './classes/queryFields'
import { 
   ModProjectArgs,
   ModProjectsOpacityArgs
} from './classes/modArgs'

@Resolver()
export class ModifyProjectsResolver {
   //TODO: Revise auth scopes
   @Authorized('SUDO')
   @Mutation(_returns => ProjectResultAndRels, {
      nullable: true,
      description: 'Modify a project'
   })
   async modProject(
      @Ctx() ctx: ApolloContext,
      @Args() { id, data, opacityUpdate }: ModProjectArgs,
   ): Promise<ProjectResult | null> {
      if(!data && !opacityUpdate) 
         throw new ApolloError('No data or opacity update inputs were provided. At least one of them must be assigned.', '406')

      const dataFilter = {
         ...data,
         relatedProjectsUpdate: undefined,
         relateeProjectsUpdate: undefined,
         techStackUpdate: undefined,
      }

      if(data?.relatedProjectsUpdate?.pushRelatedProjects?.includes(id)
      || data?.relateeProjectsUpdate?.pushAsRelateeTo?.includes(id))
         throw new ApolloError('You can relate a project to itself!', '406')

      //TODO Add related projects and tech stack query to the mutation result query when inherited 
      //! resolver is ready
      //TODO fix issue where a project can become a relatee to a already realtedProject
      const prismaRes = await ctx.prisma.project.update({
         where: { id },
         data: {
            ...opacityUpdate,
            ...dataFilter,
            relatedProjects: data?.relatedProjectsUpdate ? {
               ...(data.relatedProjectsUpdate.pushRelatedProjects && {
                  create: data.relatedProjectsUpdate.pushRelatedProjects!.map(id => ({
                     relatedTo: { connect: { id } }
                  })),
               }),
               ...(data.relatedProjectsUpdate.omitRelatedProjects && {
                  deleteMany: data.relatedProjectsUpdate.omitRelatedProjects!.map(relatedId => ({
                     relatedId
                  })),
               }),
            } : undefined,
            relatedTo: data?.relateeProjectsUpdate ? {
               ...(data.relateeProjectsUpdate.pushAsRelateeTo && {
                  create: data.relateeProjectsUpdate.pushAsRelateeTo!.map(id => ({
                     project: { connect: { id } }
                  }))
               }),
               ...(data.relateeProjectsUpdate.omitAsRelateeTo && {
                  deleteMany: data.relateeProjectsUpdate.omitAsRelateeTo!.map(projectId => ({
                     projectId
                  }))
               })
            } : undefined,
            techStack: data?.techStackUpdate ? {
               ...(data.techStackUpdate.appendTechID && {
                  create: data.techStackUpdate!.appendTechID.map(id => ({
                     tech: { connect: { id } }
                  }))
               }),
               ...(data.techStackUpdate.omitTechID && {
                  deleteMany: data.techStackUpdate.omitTechID.map(techId => ({
                     techId
                  }))
               })
            } : undefined,
         }
      }).then(res => ({
         data: res,
         message: null,
         err: null,
      })).catch(err => ({
         data: null,
         message: err.meta.target ?? 'Project update failed with unknown error!',
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
      }))

      if(prismaRes.err) 
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return prismaRes.data
   }
   
   @Authorized('SUDO')
   @Mutation(_returns => String, {
      nullable: true,
      description: 'Modify one or many projects opacity'
   })
   async modProjectsOpacity(
      @Ctx() ctx: ApolloContext,
      @Args() { 
         ids, archived, hidden 
      }: ModProjectsOpacityArgs,
   ): Promise<string | null> {
      if(!archived && !hidden)
         throw new ApolloError('No opacity update inputs were provided. At least one of them must be assigned.', '406')

      const prismaRes = await ctx.prisma.project.updateMany({
         ...(ids && { where: {
            id: {
               in: ids,
            }
         }}),
         data: {
            archived,
            hidden,
         }
      }).then(res => ({
         count: res.count,
         message: null,
         err: null,
      }))
      .catch(err => ({
         count: 0,
         message: err.meta.target ?? 'Project update failed with unknown error!',
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
      }))

      if(prismaRes.err)
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return `Successfully updated ${prismaRes.count.toString()} project`
   }
}