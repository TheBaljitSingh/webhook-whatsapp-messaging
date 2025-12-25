import { createClient } from "redis";
import dotenv from "dotenv"
dotenv.config({ path: '.env' })

const REDIS_URL = process.env.REDIS_URL;
console.log("REDIS_URL",REDIS_URL);
const isTLS = REDIS_URL.startsWith("rediss://");

export const redisClient = createClient({
  url: REDIS_URL,
  socket: isTLS ? { tls: true, rejectUnauthorized: false } : undefined
});



export async function connectRedis() {
  try {
  
    if (!redisClient.isOpen) await redisClient.connect();

    console.log("✅ Redis connected (publisher, subscriber, client)");
  } catch (err) {
    console.error("❌ Redis connection failed", err);
    process.exit(1);
  }
}


export async function disconnectRedis() {
  try {
    if (redisPublisher.isOpen) await redisPublisher.quit();
    if (redisSubscriber.isOpen) await redisSubscriber.quit();
    if (redisClient.isOpen) await redisClient.quit();

    console.log("🛑 Redis disconnected");
  } catch (err) {
    console.error("Redis disconnect error", err);
  }
}
