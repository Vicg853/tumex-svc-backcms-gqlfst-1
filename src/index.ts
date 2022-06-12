import { config as dotenv } from 'dotenv'

dotenv({
   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

import 'reflect-metadata'
import type { Config } from 'apollo-server-core'
import type { ExpressContext, ServerRegistration } from 'apollo-server-express'

import { ApolloServer } from 'apollo-server-express'
import { PrismaClient } from '@prisma/client'

import { 
   ApolloServerPluginLandingPageGraphQLPlayground,
   ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'

import { formatError } from './handlers/apollo-response'
import { context } from './handlers/apollo-context'
import { app } from './express'

//* Declaring/checking env based vars
const PORT: number = parseInt(process.env.PORT ?? '4000', 10)
const HOST: string = process.env.HOST ?? '0.0.0.0'
const ROOT_PATH: string = process.env.ROOT_PATH ?? '/'
const CORS: (string | RegExp)[] = process.env.CORS?.split(',') ?? [/^victorgomez\.dev$/]

export interface ApolloContext {
   prisma: PrismaClient
}

const apolloOpts: Config<ExpressContext> = {
   plugins: [
      process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageDisabled() 
         : ApolloServerPluginLandingPageGraphQLPlayground({
            endpoint: `${ROOT_PATH}graphqli`,
         }),
   ],
   introspection: process.env.NODE_ENV !== 'production',
}
const middlewareConfig: Omit<ServerRegistration, 'app'> = {
   path: ROOT_PATH,
   cors: {
      origin: CORS,
   }
}


export async function startServer(
   schema: Config<ExpressContext>['schema']): Promise<void> {
   const apolloServer = new ApolloServer({ 
      schema: schema!, 
      context,
      formatError,
      ...apolloOpts
   })
   
   await apolloServer.start()
   apolloServer.applyMiddleware({ app, ...middlewareConfig})

   await new Promise<void>(resolve => app.listen(PORT, HOST, resolve))
   .then(() => console.log(`🚀 Server ready at http://${HOST}:${PORT}${apolloServer.graphqlPath}`))
   .catch(e => {
      console.error("⬇📴 Shutting down server...")
      throw new Error(`Server failed to start! Cause:`, {
         cause: e
      })
   })
}
