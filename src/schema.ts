import 'reflect-metadata'
import { buildSchema } from 'type-graphql'

import path from 'path'

import { authChecker } from './auth'

import {
   CreateProjectsResolver,
   ProjectsQueriesResolver,
   ModifyProjectsResolver
} from './resolvers/projects'

export const schemaGen = async () => await buildSchema({
   resolvers: [
      CreateProjectsResolver,
      ProjectsQueriesResolver,
      ModifyProjectsResolver
   ],
   emitSchemaFile: path.resolve(__dirname, '../generated-schema.graphql'),
   authChecker,
   validate: true
})