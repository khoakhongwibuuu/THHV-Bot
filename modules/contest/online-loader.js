// Packages
const path = require('node:path');
const { dirname } = require('#assets/library/state.js');

setTimeout(async () => await require('#modules/contest/api/codeforces.api.js').exec(), 1000);
