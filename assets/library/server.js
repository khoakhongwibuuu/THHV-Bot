// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const serverPath = dirname + '/configs/server.json';
if (!fs.existsSync(serverPath)) {
    fs.writeFileSync(serverPath, JSON.stringify({
        guildID: "698528270873788466",
        log: "1183439042138865865",
        suggest: "700384376147673232",
        panel: "1152758629506748557",
        emoji: {
            yes: "700345520081600512",
            no: "700345520039657613"
        }
    }, null, 4));
}

const load = () => {
    return JSON.parse(fs.readFileSync(serverPath, 'utf8'));
}

module.exports.load = load;