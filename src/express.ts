import express from 'express'
import slowDown from 'express-slow-down'
import { printSchema, lexicographicSortSchema } from 'graphql'

import { check } from './auth/token-validation'
import { schema } from './schema'
import { roleClaim, scopesClaim, Scopes } from '@config/jwt-tkn'
import { minRole } from '@config/env'

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
   if(!req.headers.authorization
      || req.headers.authorization === null
      || !req.headers.authorization.startsWith('Bearer ')
      || req.headers.authorization.length < 8) 
      return res.status(401).send('Not authorized')
   
   const token = req.headers.authorization.replace('Bearer ', '')
   const { decodedTkn, err } = await check(token)

   if (err !== null && err === 401) return res.status(498).send('Invalid token')
   else if(err !== null) return res.status(500).send('Internal server error')

   const payload = typeof decodedTkn.payload === 'string' ?
      JSON.parse(decodedTkn.payload) : decodedTkn.payload

   const hasMinRole = (roleClaim in payload && !!payload[roleClaim].includes(minRole))
   const hasReqScope = (scopesClaim in payload && !!payload[scopesClaim].includes(Scopes.schemaRead)
     && !!payload[scopesClaim].includes(Scopes.baseaccess)) 
   if(!hasMinRole || !hasReqScope) 
     return res.status(403).send('Forbidden')

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
