const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { createClient } = require('redis');

const dbUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;

if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined');
}

if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
}

const pool = new Pool({
    connectionString: dbUrl
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const redisClient = createClient({
    url: redisUrl
});

redisClient.on('error', (err) => {
    console.error('[ERROR] Redis Client Error:', err);
});

async function connect() {
    console.log('[INFO] Database: Connecting to Postgres...');
    await prisma.$connect();
    console.log('[INFO] Database: Postgres connected successfully.');

    console.log('[INFO] Cache: Connecting to Redis...');
    await redisClient.connect();
    console.log('[INFO] Cache: Redis connected successfully.');
}

async function disconnect() {
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
}

module.exports = {
    prisma,
    redisClient,
    connect,
    disconnect
};