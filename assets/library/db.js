const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { createClient } = require('redis');

// Set up Prisma Postgres Adapter
// Check if DATABASE_URL is a raw unexpanded template string (happens locally with basic dotenv)
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('${')) {
    const user = process.env.POSTGRES_USER || 'thhv_bot_user';
    const pass = process.env.POSTGRES_PASSWORD || 'change_this_password';
    const db = process.env.POSTGRES_DB || 'thhv_bot_db';
    dbUrl = `postgresql://${user}:${pass}@localhost:5432/${db}?schema=public`;
}

const pool = new Pool({
    connectionString: dbUrl
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to databases when required
(async () => {
    try {
        await prisma.$connect();
        console.log('[INFO] Postgres connected successfully.');
    } catch (err) {
        console.error('[ERROR] Postgres connection failed:', err);
    }

    try {
        await redisClient.connect();
        console.log('[INFO] Redis connected successfully.');
    } catch (err) {
        console.error('[ERROR] Redis connection failed:', err);
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
