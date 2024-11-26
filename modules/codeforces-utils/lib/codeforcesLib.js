// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

const getData = async (API_LINK) => {
    try {
        const response = await fetch(API_LINK);
        const contentType = response.headers.get('content-type');

        const data = contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if (typeof data === 'object' && data.status === 'OK') {
            return data.result;
        } else {
            console.log(`Unable to connect to Codeforces. Please try again in a few minutes.`);
            return null;
        }
    } catch (err) {
        console.log(`Unable to connect to Codeforces. Please try again in a few minutes.`);
        console.log(err);
        return null;
    }
};

module.exports.getData = getData;