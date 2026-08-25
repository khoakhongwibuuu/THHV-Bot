const client = require('./client.js');

module.exports = {
    client,
    BotStartTime: new Date().toISOString(),
    dirname: process.cwd()
};
