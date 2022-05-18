import express from 'express'
import slowDown from 'express-slow-down'

const app = express()

const speedLimiter = slowDown({
   windowMs: 1 * 60 * 1000,
   delayAfter: 10,
   delayMs: 1000,
   skip: () => process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development',
   onLimitReached: () => console.log('⚠️  Slow down!'),
})

app.use(speedLimiter)

export { app }