import { 
   ArgsType,
   Field
} from 'type-graphql'

@ArgsType()
export class DelProjectsArgs {
   @Field(_type => [String], {
      nullable: false,
      description: 'Project(s) id(s)'
   })
   ids!: string[]
}

@ArgsType()
export class DelProjectsRelArgs {
   @Field(_type => String, {
      nullable: false,
      description: 'Project\'s id'
   })
   id!: string

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Removes all relatee link from other projects'
   })
   allRelatee?: boolean

   @Field(_type => [String], {
      nullable: true,
      description: 'Removes relatee link from specified projects'
   })
   relateeLinks?: string[]

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Removes all related projects'
   })
   allRelated?: boolean

   @Field(_type => [String], {
      nullable: true,
      description: 'Removes specified related projects'
   })
   relatedIds?: string[]
}