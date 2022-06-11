import {
  ArgsType,
  Field
} from 'type-graphql'

@ArgsType()
export class DeleteTechsInProjArgs {
  @Field(_type => String, {
    nullable: false,
    description: 'Tech\'s ID to remove from project(s).'
  })
  techId!: string

  @Field(_type => [String], {
    nullable: true,
    description: 'Projects\' ID(s) to remove tech(s) from. If empty all projects will be unlinked from this tech.'
  })
  projectIds?: string[]
}

@ArgsType()
export class DeleteProjsTechsArgs {
  @Field(_type => [String], {
    nullable: true,
    description: 'Techs\' ID(s) to remove from project. If empty all techs will be unlinked from this project.'
  })
  techIds?: string[]

  @Field(_type => String, {
    nullable: false,
    description: 'Project\'s ID to remove tech(s) from.'
  })
  projectId!: string
}


  
