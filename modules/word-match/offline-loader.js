// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.wordLib = require(path.join(dirname, '/modules/word-match/lib/wordLib.js'));
