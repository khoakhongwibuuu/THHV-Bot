// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.codeforcesLib = require(path.join(dirname, '/modules/codeforces-utils/lib/codeforcesLib.js'));
