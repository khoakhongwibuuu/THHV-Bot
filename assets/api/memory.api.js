const storage = new Map();
const crypto = require("crypto");

/**
 * Stores data with optional expiration time.
 * @param {*} data - Data to store.
 * @param {number} [expire] - Expiration time in milliseconds.
 * @returns {string} UUID used as the key.
 */
const setData = (data, expire) => {
    const uuid = crypto.randomUUID();
    storage.set(uuid, data);
    if (expire) {
        setTimeout(() => {
            if (hasData(uuid)) {
                storage.delete(uuid);
            }
        }, expire);
    }

    return uuid;
};

/**
 * Checks if the UUID exists in the store.
 * @param {string} uuid
 * @returns {boolean}
 */
const hasData = (uuid) => {
    return storage.has(uuid);
};

/**
 * Retrieves data by UUID, returns null if not found.
 * @param {string} uuid
 * @returns {*} Stored data or null.
 */
const getData = (uuid) => {
    return hasData(uuid) ? storage.get(uuid) : null;
};

/**
 * Deletes data by UUID.
 * @param {string} uuid
 * @returns {boolean}
 */
const deleteData = (uuid) => {
    return storage.delete(uuid); // returns true or false
};

module.exports = {
    setData,
    hasData,
    getData,
    deleteData
};
