import type { ProjectsFullResultType } from '../types'

import { Authorized, ObjectType, Field } from 'type-graphql'
import {
   Resource,
   Locales,
   ProjectScopes,
   Techs
} from '@prisma-gen/type-graphql'

@ObjectType({
   isAbstract: true
})
export class ProjectResult {
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

   @Field(_type => Locales, {
      nullable: false,
      description: "The project's title"
   })
   title!: ProjectsFullResultType['title']

   @Field(_type => Locales, {
      nullable: false,
      description: "The project's description"
   })
   description!: ProjectsFullResultType['description']

   @Field(_type => ProjectScopes, {
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
      nullable: false,
      description: "The project's hidden status. Requires special permissions."
   })
   hidden?: boolean;

   @Field(_type => Boolean, {
      nullable: false,
      description: "The project's archived status."
   })
   archived?: boolean;
}

@ObjectType("Project", {
   isAbstract: true
})
export class ProjectResultAndRels extends ProjectResult {
   //TODO Improve these three fields when their inheritance resovlers are ready
   //* and use this for it https://typegraphql.com/docs/1.1.1/inheritance.html#resolvers-inheritance
   @Field(_type => [ProjectResult], {
      nullable: true,
      description: 'Project\'s other related projects'
   })
   relatedProject?: ProjectResult[];
   
   @Field(_type => [ProjectResult], {
      nullable: true,
      description: 'Project\'s other related projects'
   })
   relatedTo?: ProjectResult[];

   //TODO Don't forget about adding this type TechStack[]
   @Field(_type => [Techs], {
      nullable: true
   })
   techStack?: Techs[]; //TODO don't forget about adding this type TechStack[]
}