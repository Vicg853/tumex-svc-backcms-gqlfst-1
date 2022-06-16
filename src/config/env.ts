if(!process.env.TUMEX_ROLE)
  throw new Error('TUMEX_ROLE environment variable is not set')
export const tumexRole = process.env.TUMEX_ROLE