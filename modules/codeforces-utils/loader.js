// Packages
const fs = require('fs');
const path = require('path');

const cachePath = path.join(global.dirname, 'modules/codeforces-utils/cache');
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
}

// const codeforcesLib = require("./lib/codeforcesLib");

// codeforcesLib.initCache("https://codeforces.com/api/problemset.problems", "problemset-problem");