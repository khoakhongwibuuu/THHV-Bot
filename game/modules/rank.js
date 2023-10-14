const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// load additional library
const AsciiTable = require('ascii-table');
const Table = require('cli-table');
const tableify = require('tableify');

const dirname = global.dirname;

// load game libraries
const GameLib = require(dirname + '/game/lib/standardLib.js');

// load player data
const playerDatapath = dirname + '/configs/playerdata.json';
const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));

const execute = (msg, para) => {
    msg.channel.send({
        embed: {
            color: parseInt(Base_Lang.status.warning, 16),
            description: `:no_entry_sign: ${Lang.error.locked}`
        }
    });
    return;
    if (para.length === 1) {
        const PlayerArr = Object.entries(playerdata);
        console.log(PlayerArr.length);
        // TODO: find a table library to handle Player Data e[0] = id ; e[1] : score
        setTimeout(() => {
            msg.channel.send({
                embed: {
                    title: `Bảng xếp hạng`,
                    description: `NULL`
                }
            });
        }, 100);
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.warning, 16),
                description: `: warning: ${Lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;
