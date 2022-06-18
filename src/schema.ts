import 'reflect-metadata'
import { buildSchemaSync } from 'type-graphql'

import path from 'path'

import {
   CreateProjectsResolver,
   ProjectsQueriesResolver,
   ModifyProjectsResolver,
   DeleteProjectsResolver,
   ProjectsRelationQueryResolver,
   CreateProjectRelationResolver
} from './resolvers/projects'

import {
   ObjectiveCreationResolvers,
   ObjectivesQueriesResolver,
   ObjectiveRemoveResolvers,
   ObjectiveModResolver
} from './resolvers/objectives'

import {
   TechCreateResolver,
   TechQueryResolver,
   TechDeleteResolver,
   CreateTechInProjResolver,
   DeleteTechsInProjResolver
} from './resolvers/techs'

export const schema = buildSchemaSync({
   resolvers: [
      CreateProjectsResolver,
      ProjectsQueriesResolver,
      ModifyProjectsResolver,
      DeleteProjectsResolver,
      ProjectsRelationQueryResolver,
      CreateProjectRelationResolver,
      ObjectiveCreationResolvers,
      ObjectivesQueriesResolver,
      ObjectiveRemoveResolvers,
      TechCreateResolver,
      TechQueryResolver,
      TechDeleteResolver,
      CreateTechInProjResolver,
      DeleteTechsInProjResolver,
      ObjectiveModResolver
   ],
   emitSchemaFile: process.env.NODE_ENV !== 'production' ?
	path.resolve(__dirname, '../generated-schema.graphql')
	: false,
   validate: true
})
