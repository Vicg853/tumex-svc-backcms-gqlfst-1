import type { ApolloContext } from '~/index'

import {
   Args,
   Resolver,
   Mutation,
   Ctx
} from 'type-graphql'
import { ApolloError } from 'apollo-server-core'

import { 
   ModifyTechsArgs,
   ModManyTechsArgs,
   ModTechsInBulkArgs
} from './classes/modArgs'
import { QueryFields } from './classes/queryFields'
import {
   AuthMiddle
} from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

@Resolver()
export class TechStackModResolvers {
   @AuthMiddle({
      scopes: [Scopes.techEdit]
   })
   @Mutation(_type => QueryFields, {
      description: 'Update an only tech'
   })
   async modTech(
      @Ctx() ctx: ApolloContext,
      @Args() { id, ...data }: ModifyTechsArgs,
   ): Promise<QueryFields | null> {
      if(!data || Object.keys(data).length === 0) 
         throw new ApolloError('No data to update', 'NO_DATA')

      const prismaRes = await ctx.prisma.techs.update({
         where: { id },
         data: {
            ...data,
            ...(data.inProjects && {
               inProjects: {
                  ...(data.inProjects.omit && { deleteMany: { projectId: { in: data.inProjects.omit } } }),
                  ...(data.inProjects.push && { create: 
                     data.inProjects.push.map(id => ({ project: { connect: { id }} })) 
                  })
               }
            })
         }
      }).then(res => ({
         data: res,
         err: null,
         message: null
      })).catch(err => ({
         data: null,
         err: err.code,
         message: err.message
      }))
      
      if (prismaRes.err) 
         throw new ApolloError(prismaRes.message, prismaRes.err)

      return prismaRes.data
   }

   @AuthMiddle({
      scopes: [Scopes.techEdit]
   })
   @Mutation(_type => [QueryFields], {
      description: 'Update many techs'
   })
   async modManyTechs(
      @Ctx() ctx: ApolloContext,
      @Args() { data, shared }: ModManyTechsArgs,
   ): Promise<QueryFields[] | null> {
      if(!data || data.length === 0)
         throw new ApolloError('No data to update', 'NO_DATA')

      const prismaTransaction = await ctx.prisma.$transaction(data.map(({ id, ...techData }) => 
         ctx.prisma.techs.update({
            where: { id },
            data: {
               ...techData,
               hidden: typeof techData.hidden === 'boolean' ? techData.hidden 
                  : typeof shared?.hidden === 'boolean' ? shared.hidden : undefined,
               listAsSkill: typeof techData.listAsSkill === 'boolean' ? techData.listAsSkill
                  : typeof shared?.listAsSkill === 'boolean' ? shared.listAsSkill : undefined,
               ...(techData.inProjects && {
                  inProjects: {
                     ...(techData.inProjects.omit && { deleteMany: { projectId: { in: techData.inProjects.omit } } }),
                     ...(techData.inProjects.push && { create:
                        techData.inProjects.push.map(id => ({ project: { connect: { id }} }))
                     })
                  }
               }),
               
            }
         }))
      ).then(res => ({
         data: res,
         err: null,
         message: null
      })).catch(err => ({
         data: null,
         err: err.code,
         message: err.message
      }))

      console.log(prismaTransaction)

      if (prismaTransaction.err)
         throw new ApolloError(prismaTransaction.message, prismaTransaction.err)

      return prismaTransaction.data  
   }

   @AuthMiddle({
      scopes: [Scopes.techEdit]
   })
   @Mutation(_type => [QueryFields], {
      description: 'Update many techs in bulk'
   })
   async modTechsInBulk(
      @Ctx() ctx: ApolloContext,
      @Args() { hidden, ids, listAsSkill, inProjects, filter }: ModTechsInBulkArgs,
   ): Promise<QueryFields[] | null> {
      const prismaFindIds = await ctx.prisma.techs.findMany({
         where: {
            ...(ids && {id: { in: ids }}),
            ...filter
         },
         select: { id: true }
      }).then(res => ({
         data: res,
         err: null,
         message: null
      })).catch(err => ({
         data: null,
         err: err.code,
         message: err.message
      }))

      if (prismaFindIds.err)
         throw new ApolloError(`The following error ocurred while validating projects to edit query: ${prismaFindIds.message}`, prismaFindIds.err)

      const prismaTransaction = await ctx.prisma.$transaction(prismaFindIds.data!.map(({ id }) =>
         ctx.prisma.techs.update({
            where: { id },
            data: {
               hidden,
               listAsSkill,
               ...(inProjects && {
                  inProjects: {
                     ...(inProjects.omit && { deleteMany: { projectId: { in: inProjects.omit } } }),
                     ...(inProjects.push && { create:
                        inProjects.push.map(id => ({ project: { connect: { id }} }))
                     })
                  }
               }),
            }
         }))
      ).then(res => ({
         data: res,
         err: null,
         message: null
      })).catch(err => ({
         data: null,
         err: err.code,
         message: err.message
      }))

      if (prismaTransaction.err)
         throw new ApolloError(`The following error ocurred while editing projects: ${prismaTransaction.message}`, prismaTransaction.err)

      return prismaTransaction.data
   }
}