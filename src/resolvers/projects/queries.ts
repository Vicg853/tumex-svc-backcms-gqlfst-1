import type { ApolloContext } from '~/index'
import type { Prisma } from '@prisma/client'
import type { ProjectsFullResultType } from './types'

import { Authorized, ObjectType, Field, Resolver, Query, Ctx } from 'type-graphql'
import {
   Resource,
   ProjectScopes,
   Techs
} from '@prisma-gen/type-graphql'

@ObjectType("Project", {
   isAbstract: true
})
export class ProjectFullResult {
   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => String, {
      nullable: false,
      description: "The project's id"
   })
   id!: ProjectsFullResultType['id']

   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => String, {
      nullable: false,
      description: "The project's createdAt date"
   })
   createdAt!: ProjectsFullResultType['createdAt']

   @Field(_type => String, {
      nullable: false,
      description: "The project's title"
   })
   title!: ProjectsFullResultType['title']

   @Field(_type => String, {
      nullable: false,
      description: "The project's description"
   })
   description!: ProjectsFullResultType['description']

   @Field(_type => [ProjectScopes], {
      nullable: false,
      description: 'Project\'s scope'
   })
   scopes!: ProjectsFullResultType['scopes'];

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s topics (e.g.: Backend, Frontend, etc.)'
   })
   topics?: ProjectsFullResultType['topics'];

   @Field(_type => String, {
      nullable: true,
      description: "The project's image"
   })
   image!: ProjectsFullResultType['image']

   @Field(_type => [Resource], {
      nullable: true,
      description: 'Project\'s related resources'
   })
   resources?: Resource[];

   @Field(_type => String, {
      nullable: true,
      description: "The project's github repository"
   })
   ghRepo!: ProjectsFullResultType['ghRepo']

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s websites'
   })
   website?: ProjectsFullResultType['website'];

   //TODO Figure this out
   //@Field(_type => [this], {
   //   nullable: true,
   //   description: 'Project\'s other related projects'
   //})
   //relatedProjectIds?: this[];

   //TODO Don't forget about adding this type TechStack[]
   @Field(_type => [Techs], {
      nullable: true
   })
   relatedTechStackIds?: Techs[]; //TODO don't forget about adding this type TechStack[]

   @Field(_type => Date, {
      nullable: false,
      description: 'Project\'s start date'
   })
   startDate!: ProjectsFullResultType['startDate'];

   @Field(_type => Date, {
      nullable: true,
      description: 'Project\'s end date. Leave undefined in case project is still ongoing.'
   })
   endDate?: ProjectsFullResultType['endDate'];

   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: false
   })
   hidden?: boolean;
  
   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: false
   })
   archived?: boolean;
}

@Resolver()
export class ProjectsQueriesResolver {
   @Query(_type => [ProjectFullResult], {
      nullable: false,
      description: 'Get all projects'
   })
   async projects(
      @Ctx() ctx: ApolloContext,
   ): Promise<ProjectFullResult[]> {
      return await ctx.prisma.project.findMany()
   }
}
