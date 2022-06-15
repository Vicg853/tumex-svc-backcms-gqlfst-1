import { ArgsType, Field } from 'type-graphql'

import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'
@ArgsType()
export class ProjectRelationCreate {
   @Field(_type => String, {
      nullable: false,
      description: 'Project id that will be linked to other projects'
   })
   id!: string

   @AuthMiddle({
      scopes: [Scopes.projectsRelEdit, Scopes.projectsEdit]
   })
   @Field(_type => [String], {
      nullable: true,
      description: 'Project(s) id(s) to which the project will be linked as relatee'
   })
   asRelateeTo?: string[]

   @AuthMiddle({
      scopes: [Scopes.projectsRelEdit, Scopes.projectsEdit]
   })
   @Field(_type => [String], {
      nullable: true,
      description: 'Project(s) id(s) that will be linked as relatee(s) to the project'
   })
   relatees?: string[]
}