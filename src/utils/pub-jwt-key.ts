interface AUTH0Response {
  keys: {
    alg: 'RS256' | 'HS256'
    kty: 'RSA' | 'HMAC'
    use: 'sig'
    x5c: string[]
    n: string
    e: 'AQAB'
    kid: string
    x5t: string
  }[]
}

export type JWKsPromise = string[]

type PromiseRes = ({
  err: number
  message: any
  keys: null
} | {
  err: null
  message: null
  keys: JWKsPromise
})

export async function getPubJwtKey(): Promise<PromiseRes> {
  const auth0TenEndpoint = process.env.AUTH0_TENNANT_ENDPOINT 
    + '.well-known/jwks.json'
	
  return await fetch(auth0TenEndpoint)
    .then(async res => {
      if(!res.ok || res.status !== 200) return {
	err: res.status ?? 500,
        message: res.statusText ?? 'Unknown error occured while fetching JWKs',
	keys: null
      }
      
      return await res.json()
        .then((jwks: AUTH0Response) => {
          const keysMap = jwks['keys'].filter(jwk => 
	    jwk.kid !== undefined && jwk.kid !== null 
	    && jwk.x5c.length > 0)
	    .map(jwk => jwk.x5c[0]) 

	  if(keysMap.length === 0) return {
	    err: 500,
	    message: 'No valid JWKs were found',
	    keys: null
	  }
          return {
	    err: null,
	    message: null,
            keys: keysMap	  
	  }
        })
	.catch(() => ({
          err: 500,
	  message: 'Error occured while parsing JWKs',
	  keys: null
	}))
    }).catch(err => {
      console.error('Error fetching auth0 public JWT key:', err)
      return {
        err: 500,
	message: err,
        keys: null,
      }
  })
}

export class CacheTknKeys {
  private JWTKeys?: JWKsPromise

  constructor() {}

  async init() {
    if(!!this.JWTKeys) return

    const keysFetch = await getPubJwtKey()
    if(keysFetch.err === null) 
      this.JWTKeys = keysFetch.keys
    else console.error('Error caching JWK keys. \nThe following error was returned by the get keys function:', keysFetch)
    return
  }

  async reFetch() {
    const keys = await getPubJwtKey()
    if(keys.err === null)   
      this.JWTKeys = keys.keys
    else console.error('Error caching JWK keys. \nThe following error was returned by the get keys function:', keys) 
    
    return keys
  }

  async get() {
    const keys = this.JWTKeys
    if(!keys || keys.length === 0) 
      await this.reFetch()
    return keys
  }


}
