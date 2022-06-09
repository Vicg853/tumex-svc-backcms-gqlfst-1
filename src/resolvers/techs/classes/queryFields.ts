import type { TechsType } from '../types'

import {
   Field,
   ObjectType,
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

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Defined initial hidden state. (if true it will not only be hidden in projects stacks, but also in the skills list).'
   })
   hidden?: TechsType['hidden']
}