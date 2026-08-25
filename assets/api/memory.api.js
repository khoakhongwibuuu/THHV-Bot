const { redisClient } = require('../library/db.js');
const crypto = require('crypto');

/**
 * Serialize data safely. Handles undefined.
 */
const serialize = (data) => {
    if (data === undefined) return 'undefined';
    return JSON.stringify(data, (key, value) => {
        if (typeof value === 'bigint') return { type: 'BigInt', value: value.toString() };
        if (value instanceof Map) return { type: 'Map', value: Array.from(value.entries()) };
        if (value instanceof Set) return { type: 'Set', value: Array.from(value.values()) };
        return value;
    });
};

/**
 * Deserialize data safely.
 */
const deserialize = (dataStr) => {
    if (dataStr === 'undefined') return undefined;
    if (dataStr === null) return null;
    return JSON.parse(dataStr, (key, value) => {
        if (value && typeof value === 'object') {
            if (value.type === 'BigInt') return BigInt(value.value);
            if (value.type === 'Map') return new Map(value.value);
            if (value.type === 'Set') return new Set(value.value);
        }
        return value;
    });
};

/**
 * Store data with given key and optional expiration time.
 * @param {string} key - Key of the data.
 * @param {*} data - Data to store.
 * @param {number} [expire_ms] - Expiration time in milliseconds.
 * @returns {Promise<boolean>} Return true if the data can be added, false otherwise.
 */
const setDataWithKey = async (key, data, expire_ms) => {
    const options = { NX: true };
    if (expire_ms) options.PX = expire_ms;
    
    const result = await redisClient.set(`memory:${key}`, serialize(data), options);
    return result === 'OK';
};

/**
 * Stores data with optional expiration time.
 * @param {*} data - Data to store.
 * @param {number} [expire_ms] - Expiration time in milliseconds.
 * @returns {Promise<string>} UUID used as the key.
 */
const setData = async (data, expire_ms) => {
    const uuid = crypto.randomUUID();
    const options = {};
    if (expire_ms) options.PX = expire_ms;
    
    await redisClient.set(`memory:${uuid}`, serialize(data), options);
    return uuid;
};

/**
 * Checks if the UUID exists in the store.
 * @param {string} uuid - uuid of data
 * @returns {Promise<boolean>} Return true if the data is present, false otherwise.
 */
const hasData = async (uuid) => {
    const count = await redisClient.exists(`memory:${uuid}`);
    return count === 1;
};

/**
 * Retrieves data by UUID, returns null if not found.
 * @param {string} uuid - uuid of data
 * @returns {Promise<*>} Stored data or null.
 */
const getData = async (uuid) => {
    const data = await redisClient.get(`memory:${uuid}`);
    return data ? deserialize(data) : null;
};

/**
 * Deletes data by UUID.
 * @param {string} uuid - uuid of data
 * @returns {Promise<boolean>} Return true if the data can be deleted, false otherwise.
 */
const deleteData = async (uuid) => {
    const count = await redisClient.del(`memory:${uuid}`);
    return count === 1;
};

/**
 * Modifies data if present and retains its expiration.
 * @param {*} uuid - uuid of data
 * @param {*} newData - new value of data
 * @returns {Promise<boolean>} Return true if the data is present and modified, false otherwise.
 */
const modifyData = async (uuid, newData) => {
    const result = await redisClient.set(`memory:${uuid}`, serialize(newData), {
        XX: true,
        KEEPTTL: true
    });
    return result === 'OK';
}

module.exports = {
    setDataWithKey,
    setData,
    hasData,
    getData,
    deleteData,
    modifyData
};
