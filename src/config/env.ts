if(!process.env.TUMEX_ROLE)
  throw new Error('TUMEX_ROLE environment variable is not set')
export const tumexRole = process.env.TUMEX_ROLE

if(!process.env.MIN_ROLE)
  throw new Error('MIN_ROLE environment variable is not set')
export const minRole = process.env.MIN_ROLE
