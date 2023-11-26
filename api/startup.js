const fs = require('fs');

const dirname = global.dirname;

// Creating config directory
if (!fs.existsSync(dirname + '/configs')) {
    fs.mkdirSync(dirname + '/configs', { recursive: true });
}

// Creating log directory
if (!fs.existsSync(dirname + '/logs')) {
    fs.mkdirSync(dirname + '/logs', { recursive: true });
}

// Creating default configuration files

// config.json for general settings
if (!fs.existsSync(dirname + '/configs/config.json')) {
    fs.writeFileSync(dirname + '/configs/config.json', JSON.stringify({
        owner: [""],
        log_usage: false,
        notify_hours: [1, 6, 24],
        prefix: "--",
        language: "en-us",
        timezone: 0
    }, null, 4));
}

// auth.json for authorisation token
if (!fs.existsSync(dirname + '/configs/auth.json')) {
    fs.writeFileSync(dirname + '/configs/auth.json', JSON.stringify({
        token: "",
    }, null, 4));
}

// persist.json for notifying feature logging
if (!fs.existsSync(dirname + '/configs/persist.json')) {
    fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify({
        ready: {},
        channel: {}
    }));
}

// server.json for server-based settings
if (!fs.existsSync(dirname + '/configs/server.json')) {
    fs.writeFileSync(dirname + '/configs/server.json', JSON.stringify({
        notify_role: "",
        log_channel: "",
        suggest_channel: "",
        multiple_choice_grandmaster: ""
    }, null, 4));
}

// Write updating scripts below this line
// ======================================