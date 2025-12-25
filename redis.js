import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;


export const redisPublisher = createClient({
  url: REDIS_URL,
});

export const redisSubscriber = createClient({
  url: REDIS_URL
});


export const redisClient = createClient({
  url: REDIS_URL
});


export async function connectRedis() {
  try {
    if (!redisPublisher.isOpen) await redisPublisher.connect();
    if (!redisSubscriber.isOpen) await redisSubscriber.connect();
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
