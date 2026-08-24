// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.reactLib = require(path.join(dirname, '/modules/auto-reactor/lib/reactLib.js'));
