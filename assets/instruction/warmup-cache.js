const { prisma, redisClient } = require('#assets/library/db.js');

const warmupCache = async () => {
    console.log('[INFO] Cache: Warming up module configurations...');

    try {
        // 1. Fetch all configurations in one bulk query
        const configs = await prisma.guildConfig.findMany();

        // 2. Load them into Redis using a transaction/pipeline
        const pipeline = redisClient.multi();
        configs.forEach(record => {
            pipeline.set(`config:${record.module}:${record.guildId}`, JSON.stringify(record.data));
        });

        await pipeline.exec();
        console.log(`[INFO] Cache: Successfully loaded ${configs.length} configs into Redis.`);
    } catch (error) {
        console.error('[WARN] Cache: Failed to warmup cache:', error);
    }
};

module.exports = { warmupCache };
