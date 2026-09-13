const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { createClient } = require('redis');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({
    connectionString: dbUrl
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
}

const redisClient = createClient({
    url: redisUrl
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to databases when required
(async () => {
    try {
        console.log('[INFO] Database: Connecting to Postgres...');
        await prisma.$connect();
        console.log('[INFO] Database: Postgres connected successfully.');
    } catch (err) {
        console.error('[ERROR] Database: Postgres connection failed:', err);
    }

    try {
        console.log('[INFO] Cache: Connecting to Redis...');
        await redisClient.connect();
        console.log('[INFO] Cache: Redis connected successfully.');
    } catch (err) {
        console.error('[ERROR] Cache: Redis connection failed:', err);
    }
})();

const disconnect = async () => {
    try {
        await prisma.$disconnect();
        await pool.end();
        console.log('[INFO] Postgres disconnected.');
    } catch (err) {
        console.error('[ERROR] Postgres disconnect failed:', err);
    }

    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            console.log('[INFO] Redis disconnected.');
        }
    } catch (err) {
        console.error('[ERROR] Redis disconnect failed:', err);
    }
};

module.exports = {
    prisma,
    redisClient,
    disconnect
};
