// Special library
const fs = require('fs');

// Basic variables
const Utils = global.Utils;
const dirname = global.dirname;

const register = dirname + '/configs/registered.json';

const loadPublic = () => {
    const raw = JSON.parse(fs.readFileSync(register, 'utf8'));
    return raw.public;
}

const loadPrivate = () => {
    const raw = JSON.parse(fs.readFileSync(register, 'utf8'));
    return raw.private;
}

const loadGame = () => {
    const raw = JSON.parse(fs.readFileSync(register, 'utf8'));
    return raw.game;
}

const loadTrigger = () => {
    const raw = JSON.parse(fs.readFileSync(register, 'utf8'));
    return raw.auto;
}

module.exports.loadPublic = loadPublic;
module.exports.loadPrivate = loadPrivate;
module.exports.loadGame = loadGame;
module.exports.loadTrigger = loadTrigger;