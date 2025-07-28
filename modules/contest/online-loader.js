// Packages
const path = require('node:path');
const { dirname } = global.variable;

setTimeout(async () => await require(path.join(dirname, 'modules/contest/api/codeforces.api.js')).exec(), 1000);
