import 'reflect-metadata'
import { buildSchema } from 'type-graphql'

import path from 'path'

import { authChecker } from './auth'

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
   ObjectiveRemoveResolvers
} from './resolvers/objectives/index'

import {
   TechCreateResolver,
   TechQueryResolver
} from './resolvers/techs'

export const schemaGen = async () => await buildSchema({
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
      TechQueryResolver
   ],
   emitSchemaFile: path.resolve(__dirname, '../generated-schema.graphql'),
   authChecker,
   validate: true
})