import { redis } from "../config/config"
export const redisConnect = {
    redis:{ 
        host: redis.host,
        port: redis.port
    }
}
