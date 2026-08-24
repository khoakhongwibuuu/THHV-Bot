// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.contestLib = require(path.join(dirname, '/modules/contest/lib/contestLib.js'));
