// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.gameLib = require(path.join(dirname, '/modules/trivia-game/lib/gameLib.js'));
