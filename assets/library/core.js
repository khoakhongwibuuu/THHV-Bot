// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const corePath = dirname + '/configs/core.json';

if (!fs.existsSync(corePath)) {
    fs.writeFileSync(corePath, JSON.stringify({
        owner: "671624293674909717",
        trusted: [],
        timezone: 7,
        notificationRole: "1139230081236090910",
        notificationHour: 24
    }, null, 4));
}

const load = () => {
    return JSON.parse(fs.readFileSync(corePath, 'utf8'));
}

module.exports.load = load;