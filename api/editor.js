const fs = require('fs');
const dirname = global.dirname

const Config_Path = dirname + '/configs/config.json';
const config = JSON.parse(fs.readFileSync(Config_Path, 'utf8'));
const saveconfig = () => { fs.writeFileSync(Config_Path, JSON.stringify(config, null, 4)); }

const Config_editor = (key, value, overwrite) => {
    if (!config.hasOwnProperty(key) || overwrite) {
        config[key] = value;
        saveconfig();
    }
}

const Server_Path = dirname + '/configs/server.json'
const server = JSON.parse(fs.readFileSync(Server_Path, 'utf8'));
const saveserver = () => { fs.writeFileSync(Server_Path, JSON.stringify(server, null, 4)); }

const Server_editor = (key, value, overwrite) => {
    if (!server.hasOwnProperty(key) || overwrite) {
        server[key] = value;
        saveserver();
    }
}

const update = () => {
    // first release, no config updates
}

const statusReset = () => {
    const statusPath = dirname + '/configs/gamestatus.json';
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    if (status.running === 1) {
        status.running = 0;
        fs.writeFileSync(statusPath, JSON.stringify(status));
    }
}

module.exports.Config_editor = Config_editor;
module.exports.Server_editor = Server_editor;
module.exports.update = update;
module.exports.statusReset = statusReset;
