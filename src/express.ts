import express from 'express'
import slowDown from 'express-slow-down'
import { printSchema, lexicographicSortSchema } from 'graphql'

import { schema } from './schema'

const app = express()

const speedLimiter = slowDown({
   windowMs: 1 * 60 * 1000,
   delayAfter: 10,
   delayMs: 1000,
   skip: () => process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development',
   onLimitReached: () => console.log('⚠️  Slow down!'),
})

app.use(speedLimiter)

app.route('/schema').get(async (req, res) => {
   

   try {
     const schemaSDL = printSchema(lexicographicSortSchema(schema), {
        commentDescriptions: true,
     })

     res.set('Content-Type', 'text/plain')
     res.status(200).send(schemaSDL)
   } catch (err) {
     console.error(`Error while serving or generating gql SDL schema: ${err}`)
     res.status(500).send(`Error while serving or generating gql SDL schema.`)
   }
})

export { app }
