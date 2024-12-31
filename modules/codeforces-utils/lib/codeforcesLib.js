// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

const CACHE_DIR = path.join(global.dirname, 'modules/codeforces-utils/cache');
const CACHE_DURATION = 1000 * 3600 * 6;
// const CACHE_DURATION = 1000 * 10;

const fetchData = async (apiLink) => {
    try {
        const response = await fetch(apiLink);
        const contentType = response.headers.get('content-type');
        const data = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if (typeof data === 'object' && data.status === 'OK') {
            return data.result;
        }
        console.error('Invalid response from Codeforces API.');
        return null;
    } catch (err) {
        console.error('Error fetching data from Codeforces API:', err.message);
        return null;
    }
};

const cacheExists = async (cacheName) => {
    try {
        fs.access(path.join(CACHE_DIR, `${cacheName}.tmp`));
        return true;
    } catch {
        return false;
    }
};

const readCache = async (cacheName) => {
    try {
        const filePath = path.join(CACHE_DIR, `${cacheName}.tmp`);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        return null;
    }
};

const writeCache = async (cacheName, cacheData) => {
    try {
        const filePath = path.join(CACHE_DIR, `${cacheName}.tmp`);
        const jsonData = JSON.stringify(cacheData);
        fs.writeFileSync(filePath, jsonData, 'utf-8');
    } catch (err) {
        console.error('Error writing to cache:', err.message);
    }
};

const getCacheUpdateTime = async (cacheName) => {
    const cacheData = await readCache(cacheName);
    return cacheData?.dateModified || null;
};

const updateCache = async (apiLink, cacheName) => {
    console.log(`[${new Date().toISOString()}] [INFO] Client: found outdated ${cacheName} database. Try updating.`);
    const freshData = await fetchData(apiLink);
    if (freshData) {
        const cacheData = {
            status: "OK",
            dateModified: new Date().getTime(),
            response: freshData
        };
        await writeCache(cacheName, cacheData);
        console.log(`[${new Date().toISOString()}] [SUCCESS] Client: updated ${cacheName} database successfully. Next database update will occur in ${CACHE_DURATION / 1000 / 3600} hours.`);
    } else {
        console.error(`[${new Date().toISOString()}] [ERROR] Invalid data. Try updating ${cacheName} database again in ${CACHE_DURATION / 1000 / 3600} hours.`);
    }
};

const initCache = async (apiLink, cacheName, refreshInterval = CACHE_DURATION) => {
    if (!cacheExists(cacheName)) {
        await writeCache(cacheName, {});
    }

    const lastUpdateTime = await getCacheUpdateTime(cacheName);
    const now = new Date().getTime();

    if (!lastUpdateTime || now - lastUpdateTime > refreshInterval) {
        await updateCache(apiLink, cacheName);
    }

    setInterval(async () => {
        await updateCache(apiLink, cacheName);
    }, refreshInterval);
};

const offlineFetch = async (apiLink, cacheName) => {
    const data = await readCache(cacheName);
    if (!data) {
        return await fetchData(apiLink);
    } else {
        return data.result;
    }
};

module.exports = {
    initCache,
    readCache,
    writeCache,
    updateCache,
    cacheExists,
    fetchData,
    offlineFetch
};