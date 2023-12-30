// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const serverPath = dirname + '/configs/server.json';
if (!fs.existsSync(serverPath)) {
    fs.writeFileSync(serverPath, JSON.stringify({
        guildID: "",
        log: "",
        suggest: "",    
        emoji: {
            yes: "",
            no: ""
        }
    }, null, 4));
}

const load = () => {
    return JSON.parse(fs.readFileSync(serverPath, 'utf8'));
}

module.exports.load = load;