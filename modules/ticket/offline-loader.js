// Packages
const path = require('node:path');
const { dirname } = global.variable;

global.customLib.ticketLib = require(path.join(dirname, '/modules/ticket/lib/ticketLib.js'));
