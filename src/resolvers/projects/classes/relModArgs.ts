import { Authorized, ObjectType, Field, ArgsType, InputType } from 'type-graphql'
import {
   Resource,
   Locales,
   ProjectScopes,
   Techs
} from '@prisma-gen/type-graphql'
import {

} from '../'

@InputType('ModifyProjectTechStack', {
   isAbstract: true
})
export class ModProjectTechStack {
   //TODO Improve this to include create option when its nested resolver is implemented
   @Field(_type => [String], {
      nullable: true,
      description: "Append new techs to the project's tech stack"
   })
   appendTechID!: string[]

   @Field(_type => [String], {
      nullable: true,
      description: "Omit techs from the project's tech stack"
   })
   omitTechID!: string[]
}

@InputType('ModifyProjectToProjectAsRelatee', {
   isAbstract: true
})
export class ModProjToProjAsRelatee {
   @Field(_type => [String], {
      nullable: true,
      description: "Push as relatee to other projects"
   })
   pushAsRelateeTo?: string[]

   @Field(_type => [String], {
      nullable: true,
      description: "Omit as relatee to one or many other project(s)"
   })
   omitAsRelateeTo?: string[]
}

@InputType('ModifyProjectToProjectRelated', {
   isAbstract: true
})
export class ModProjToProjRelated {
   //TODO Improve this to include create option when its nested resolver is implemented
   @Field(_type => [String], {
      nullable: true,
      description: "Push new related projects to related array"
   })
   pushRelatedProjects?: string[]

   @Field(_type => [String], {
      nullable: true,
      description: "Omit related projects from related array"
   })
   omitRelatedProjects?: string[]
}

