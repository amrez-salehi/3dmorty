import Redis from "ioredis"
import { MedusaError } from "@medusajs/framework/utils"

declare global {
  // Keep one connection while the development server reloads modules.
  var storeRedisConnection: Redis | undefined
}

export const getRedisConnection = () => {
  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "REDIS_URL is not configured"
    )
  }

  if (!global.storeRedisConnection) {
    global.storeRedisConnection = new Redis(redisUrl, {
      connectTimeout: 5_000,
      enableReadyCheck: true,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    })
  }

  return global.storeRedisConnection
}
