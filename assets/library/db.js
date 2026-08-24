const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { createClient } = require('redis');

// Set up Prisma Postgres Adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://root:secret_password@localhost:5432/thhv_bot_db?schema=public'
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis when required
(async () => {
    try {
        await redisClient.connect();
        console.log('[INFO] Redis connected successfully.');
    } catch (err) {
        console.error('[ERROR] Redis connection failed:', err);
    }
})();

module.exports = {
    prisma,
    redisClient
};
