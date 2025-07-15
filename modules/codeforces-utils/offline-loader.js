// Packages
const path = require('node:path');
const { dirname } = global.variable;

const codeforcesLib = require(path.join(dirname, '/modules/codeforces-utils/lib/codeforcesLib.js'));
global.customLib.codeforcesLib = codeforcesLib;