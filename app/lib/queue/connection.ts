const host = process.env.UPSTASH_REDIS_HOST;
const password = process.env.UPSTASH_REDIS_PASSWORD;
if (!host || !password) {
  throw new Error(
    "Redis env missing. Set UPSTASH_REDIS_HOST, UPSTASH_REDIS_PASSWORD (and optionally UPSTASH_REDIS_PORT) in .env"
  );
}

const redisConnection = {
  host,
  port: Number(process.env.UPSTASH_REDIS_PORT) || 6379,
  password,
  tls: {},
};

export default redisConnection;
