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
    scopes: string[]
    roles: string[]
    authed: true
    err: null
  } & ({
    isTumex: true
    hasMinSope: false
  } | {
    isTumex: false
    hasMinSope: true
  })) | {
    token: null
    scopes: null
    roles: null
    isTumex: false
    hasMinSope: false
    authed: true
    err: null
  } | {
    token: null
    scopes: null
    roles: null
    isTumex: false
    hasMinSope: false
    authed: false
    err: Err | null
  }
}

export const context: ContextFunction<{req: Request}, ApolloContext> = async ({ req }): Promise<ApolloContext> => { 
  const authHeader = (req.headers.authorization ?? undefined) as string | undefined

  if(!authHeader || !authHeader.startsWith('Bearer ')) return { 
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinSope: false, authed: false, err: null,
    }
  }
  
  const token = authHeader.replace('Bearer ', '')
  if(!token) return {
    prisma, auth: { 
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinSope: false, authed: false, err: null,
    }
  }
  
  const { decodedTkn, message, err } = await check(token)
  if (err !== null && err === 401) return {
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      hasMinSope: false, authed: false, err: null,
    }
  }
  if(err !== null) return {
    prisma, auth: {
      token: null, scopes: null, roles: null,
      hasMinSope: false, authed: false, isTumex: false,
      err: { code: err, message },
    }
  }

  const payload = typeof decodedTkn.payload === 'string' ? 
    JSON.parse(decodedTkn.payload) : decodedTkn.payload
	
  if(!(scopesClaim in payload) || !(roleClaim in payload)) return {
    prisma, auth: {
      token: null, scopes: null, roles: null,
      hasMinSope: false, authed: true, isTumex: false,
      err: null,
    }
  }

  if(payload[roleClaim].includes(tumexRole)) return {
    prisma, auth: {
      token: { original: token, decoded: decodedTkn },
      scopes: payload[scopesClaim],
      roles: payload[roleClaim],
      isTumex: true,
      hasMinSope: false, authed: true, err: null,
    }
  }

  if(!payload[roleClaim].includes(minRole)) return {
    prisma, auth: {
      token: null, scopes: null, roles: null, 
      isTumex: false, hasMinSope: false, authed: true,
      err: null,
    }
  }

  return { 
    prisma, 
    auth: {
      token: { original: token, decoded: decodedTkn },
      scopes: payload[scopesClaim].split(' '),
      roles: payload[roleClaim].split(' '),
      isTumex: false,
      hasMinSope: true,
      authed: true,
      err: null,
    }
  }
}
