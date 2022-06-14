import type { ApolloContext } from '~/index'
import type { ContextFunction } from 'apollo-server-core'
import type { Request } from 'express'
import type { Jwt } from 'jsonwebtoken'

import { prisma } from '@lib/prisma-client'

import { check } from '../auth/token-validation'

if(!process.env.TUMEX_ROLE)
  throw new Error('TUMEX_ROLE environment variable is not set')
const tumexRole = process.env.TUMEX_ROLE

if(!process.env.MIN_ROLE)
  throw new Error('MIN_ROLE environment variable is not set')
const minRole = process.env.MIN_ROLE

const roleClaim = 'roles'
const scopesClaim = 'scope'
interface Err {
   code: number
   message: string
}

export interface ApolloContextExtension {
  auth: ({
    token: {
      original: string
      decoded: Jwt
    }
    scopes: string[] | null
    roles: string[] | null
    authed: true
    invalidTkn: false
    err: null
  } & ({
    isTumex: true
    hasMinRole: true
  } | {
    isTumex: false
    hasMinRole: boolean
  })) | {
    token: null
    scopes: null
    roles: null
    isTumex: false
    hasMinRole: false
    authed: false
    invalidTkn: boolean
    err: Err | null
  }
}

export const context: ContextFunction<{req: Request}, ApolloContext> = async ({ req }): Promise<ApolloContext> => { 
  const authHeader = (req.headers.authorization ?? undefined) as string | undefined

  if(!authHeader || !authHeader.startsWith('Bearer ')) return { 
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinRole: false, authed: false, err: null, invalidTkn: false
    }
  }
  
  const token = authHeader.replace('Bearer ', '')
  if(!token) return {
    prisma, auth: { 
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinRole: false, authed: false, err: null, invalidTkn: false
    }
  }
  
  const { decodedTkn, message, err } = await check(token)
  if (err !== null && err === 401) return {
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinRole: false, authed: false, err: null, invalidTkn: true
    }
  }
  if(err !== null) return {
    prisma, auth: {
      token: null, scopes: null, roles: null,
      hasMinRole: false, authed: false, isTumex: false,
      err: { code: err, message }, invalidTkn: false
    }
  }

  const payload = typeof decodedTkn.payload === 'string' ? 
    JSON.parse(decodedTkn.payload) : decodedTkn.payload

  if(roleClaim in payload && 
    payload[roleClaim].includes(tumexRole)) return {
    prisma, auth: {
      token: { original: token, decoded: decodedTkn },
      scopes: payload[scopesClaim],
      roles: payload[roleClaim],
      isTumex: true, invalidTkn: false,
      hasMinRole: true, authed: true, err: null,
    }
  }

  return { 
    prisma, 
    auth: {
      token: { original: token, decoded: decodedTkn },
      scopes: !(scopesClaim in payload) ? null : 
	     payload[scopesClaim].split(' '),
      roles: !(roleClaim in payload) ? null :
        payload[roleClaim].split(' '),
      isTumex: false,
      hasMinRole: (roleClaim in payload && 
        payload[roleClaim].includes(minRole)),
      authed: true,
      invalidTkn: false,
      err: null,
    }
  }
}
