// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.formLib = require(path.join(dirname, '/modules/approval-form/lib/formLib.js'));
