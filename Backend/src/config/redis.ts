import { Redis } from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
})

redisClient.on('connect', () => {
  console.log('✅ Redis Client Connected')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err)
})

export { redisClient }
