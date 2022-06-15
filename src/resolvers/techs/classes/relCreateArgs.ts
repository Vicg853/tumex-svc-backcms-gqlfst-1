import {
  Field,
  ArgsType
} from 'type-graphql'

@ArgsType()
export class CreateTechInProjArgs {
  @Field(_type => [String], {
    nullable: false,
    description: 'Tech\'s ID(s) to add to project(s).'
  })
  techId!: string[]

  @Field(_type => [String], {
    nullable: false,
    description: 'Project\'s ID(s) to add tech(s) to.'
  })
  projectId!: string[]
}
