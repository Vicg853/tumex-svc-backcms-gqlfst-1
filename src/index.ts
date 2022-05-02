import 'reflect-metadata'
import type { ListenOptions } from 'net'
import type { Config } from 'apollo-server-core'
import type { ExpressContext, ServerRegistration } from 'apollo-server-express'

import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'

//* Env init
dotenv.config({
   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

//* Declaring/checking env based vars
const PORT: number = parseInt(process.env.PORT ?? '4000', 10)
const HOST: string = process.env.HOST ?? '0.0.0.0'
const ROOT_PATH: string = process.env.ROOT_PATH ?? '/'

//* Main server vars
const app = express()
const httpServer = http.createServer(app)

//* Configs
const httpServerOpt: ListenOptions = {
   port: PORT,
   host: HOST,
}
const apolloOpts: Config<ExpressContext> = {
   plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
   ],
}
const middlewareConfig: Omit<ServerRegistration, 'app'> = {
   path: ROOT_PATH,
}


async function startServer(
   schema: Config<ExpressContext>['schema']): Promise<void> {

   const apolloServer = new ApolloServer({ schema, ...apolloOpts })
   
   await apolloServer.start()
   apolloServer.applyMiddleware({ app, ...middlewareConfig})

   await new Promise<void>(resolve => httpServer.listen(httpServerOpt, resolve))
   .then(() => console.log(`🚀 Server ready at http://${HOST}:${PORT}${apolloServer.graphqlPath}`))
   .catch(e => {
      throw new Error(`Server failed to start! Cause:`, {
         cause: e
      })
   })
}

//startServer(
//   
//)