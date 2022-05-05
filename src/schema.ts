import 'reflect-metadata'
import { buildSchema } from 'type-graphql'

import path from 'path'

import { authChecker } from './auth'

import {
   ObjectivesResolver
} from './resolvers'

export const schemaGen = async () => await buildSchema({
   resolvers: [
      ObjectivesResolver
   ],
   emitSchemaFile: path.resolve(__dirname, '../generated-schema.graphql'),
   authChecker,
   validate: true
})