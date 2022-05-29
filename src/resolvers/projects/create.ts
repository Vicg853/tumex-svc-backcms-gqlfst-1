import type { ApolloContext } from '~/index'
import type { ProjectsFullResultType } from './types'

import { Field, InputType, ArgsType, Resolver, Mutation, Ctx, Args, Authorized } from 'type-graphql'
import {
   Locales,
   Resource,
   ProjectScopes,
   LocalesCreateInput,
   ResourceCreateInput
} from '@prisma-gen/type-graphql'

import { ProjectFullResult } from './queries'

@ArgsType()
class CreateProjectArgs {
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
  
   @Field(_type => [ProjectScopes], {
      nullable: false,
      description: 'Project\'s scopes'
   })
   scopes!: Array<"PERSONAL" | "PROFESSIONAL" | "OPENSOURCE" | "NONPROFIT">;
  
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

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s other related projects'
   })
   relatedProjectIds?: string[];

   @Field(_type => [String], {
      nullable: true
   })
   relatedTechStackIds?: string[];

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

@Resolver()
export class CreateProjectsResolver {
   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Mutation(_returns => ProjectFullResult, {
      name: 'createProject',
      nullable: true,
      description: 'Create a new project'
   })
   async createProject(
      @Ctx() ctx: ApolloContext,
      @Args() project: CreateProjectArgs,
   ): Promise<Omit<ProjectsFullResultType, ''> | null> {
      const create = await ctx.prisma.project.create({
         data: {
            ...project,
         }
      })

      return create
   }

}