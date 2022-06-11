import type { TechsType } from '../types'

import {
   Field,
   ObjectType,
   Authorized
} from 'type-graphql'

@ObjectType()
export class QueryFields {
   @Field(_type => String, {
      nullable: false,
      description: 'The technology\'s name'
   })
   id!: TechsType['id']

   @Field(_type => String, {
      nullable: false,
      description: 'The technology\'s name'
   })
   createdAt!: TechsType['createdAt']

   @Field(_type => String, {
      nullable: false,
      description: 'The technology\'s name'
   })
   name!: TechsType['name']

   @Field(_type => String, {
      nullable: true,
      description: 'The technology\'s logo'
   })
   logo?: TechsType['logo']

   @Field(_type => String, {
      nullable: true,
      description: 'The technology\'s source url'
   })
   url?: TechsType['url']

   @Field(_type => Number, {
      nullable: false,
      description: 'Years of experience with this technology'
   })
   aproxExpYears!: TechsType['aproxExpYears']

   @Field(_type => Number, {
      nullable: true,
      description: 'Aprox projects using this technology'
   })
   aproxProjUse?: TechsType['aproxProjUse']

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Define the initial "list as skill" state'
   })
   listAsSkill?: TechsType['listAsSkill']

   //TODO Check auth scopes
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Defined initial hidden state. (if true it will not only be hidden in projects stacks, but also in the skills list).'
   })
   hidden?: TechsType['hidden']
}

@ObjectType()
export class GroupedQueryFields {
   @Field(_type => Number, {
     nullable: true,
     description: 'The experience year group value'
   })
   aproxExpYears?: number | null

   @Field(_type => Number, {
     nullable: true,
     description: 'In projects usage grouping value'
   })
   aproxProjUse?: number | null

   @Field(_type => String, {
       nullable: true,
      description: 'The tech\'s related project id'
   })
   projId?: string

   @Field(_type => [QueryFields], {
     nullable: false,
     description: 'The technologies grouped by the specified field(s)'
   })
   techs!: TechsType[]
}
