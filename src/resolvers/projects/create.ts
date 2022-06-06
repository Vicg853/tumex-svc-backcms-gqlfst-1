import type { ApolloContext } from '~/index'
import type { ProjectsFullResultType } from './types'

import { ApolloError } from 'apollo-server-core'
import { Field, InputType, ArgsType, Resolver, Mutation, Ctx, Args, Authorized } from 'type-graphql'
import {
   ProjectScopes,
   LocalesCreateInput,
   ResourceCreateInput
} from '@prisma-gen/type-graphql'

import { ProjectResultAndRels } from './classes/queryFields'

@InputType()
@ArgsType()
class BasicProjectArgs {
   @Field(_type => LocalesCreateInput, {
      nullable: false,
      description: 'Project\'s title locales'
   })
   title!: LocalesCreateInput;

   @Field(_type => LocalesCreateInput, {
      nullable: false,
      description: 'Project\'s description locales'
   })
   description!: LocalesCreateInput;
  
   @Field(_type => ProjectScopes, {
      nullable: false,
      description: 'Project\'s scopes'
   })
   scopes!: ProjectScopes;
  
   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s topics (e.g.: Backend, Frontend, etc.)'
   })
   topics?: string[];
   
   @Field(_type => String, {
      nullable: true,
      description: 'Project\'s image'
   })
   image?: string | null;
   
   @Field(_type => [ResourceCreateInput], {
      nullable: true,
      description: 'Project\'s related resources'
   })
   resources?: ResourceCreateInput[];

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s github repositories'
   })
   ghRepo?: string[];

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s websites'
   })
   website?: string[];

   @Field(_type => Date, {
      nullable: false,
      description: 'Project\'s start date'
   })
   startDate!: Date;

   @Field(_type => Date, {
      nullable: true,
      description: 'Project\'s end date. Leave undefined in case project is still ongoing.'
   })
   endDate?: Date | null;

   @Field(_type => Boolean, {
      nullable: true
   })
   hidden?: boolean;
  
   @Field(_type => Boolean, {
      nullable: true
   })
   archived?: boolean;
}

@InputType()
@ArgsType()
class CreateProjectArgs extends BasicProjectArgs {
   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s other related projects'
   })
   relatedProjectIds?: string[];

   @Field(_type => [String], {
      nullable: true
   })
   techStackIds?: string[];
}

@ArgsType()
class CreateManyProjectsArgs {
   @Field(_type => [BasicProjectArgs], {
      nullable: false,
      description: 'Projects to create'
   })
   projects!: BasicProjectArgs[];

}

@Resolver()
export class CreateProjectsResolver {
   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Mutation(_returns => ProjectResultAndRels, {
      name: 'createProject',
      nullable: true,
      description: 'Create a new project'
   })
   async createProject(
      @Ctx() ctx: ApolloContext,
      @Args() project: CreateProjectArgs,
   ): Promise<ProjectsFullResultType | null | { extensions: { code: string } }> {
      const relatedProject = project.relatedProjectIds
      const relatedTechStacks = project.techStackIds

      const data = {
         ...project,
         relatedProjectIds: undefined,
         techStackIds: undefined
      }

      const create = await ctx.prisma.project.create({
         data: {
            ...data,
            relatedProjects: {
               create: relatedProject ? relatedProject.map(id => ({
                  relatedTo: {
                     connect: {
                        id
                     }
                  }
               })) : undefined,
            },
            techStack: {
               create: relatedTechStacks?.map(id => ({
                  tech: {
                     connect: {
                        id
                     }
                  }
               }))
            }
         },
      }).then(res => {
         return {
            data: res,
            err: null,
         }
      }).catch(err => {
         return {
            data: null,
            err: err.code ?? 'INTERNAL_SERVER_ERROR',
         }
      })
      
      if(!!create.err) 
         throw new ApolloError(`Project creation failed!`, create.err)

      return create.data
   }

   @Authorized("SUDO")
   @Mutation(_returns => Number, {
      name: 'createManyProjects',
      nullable: true,
      description: 'Creates many projects. Return a count of created projects.'
   })
   async createManyProjects(
      @Ctx() ctx: ApolloContext,
      @Args() { projects }: CreateManyProjectsArgs,
   ): Promise<number | null | { extensions: { code: string } }> {
      //TODO Add global input as default values
      const create = await ctx.prisma.project.createMany({
         data: projects
      })

      return create.count
   }
}