// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const GameLib = require(dirname + '/game/lib/standardLib.js');
    const gameSetting = GameLib.loadSetting();
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();

    if (para.length === 0) {
        msg.react('✅');
        msg.channel.send(`**How to play ?**`
            + `\n`
            + `> Players will take turns using \`${config.prefix}play\` command to receive a random question.\n`
            + `\n`
            + `> There will be \`2\` types of questions: \`Multiple choice\` and \`True or False\`\n`
            + `> The time limit may vary according to the question's level of difficulty. You always have ${gameSetting.ETA} seconds or more to respond.\n`
            + `\n`
            + `> Only \`ONE\` response per player is permitted.\n`
            + `> Think carefully before responding because a correct response will bring \`${Math.abs(gameSetting.up)}\` points, but an incorrect response will result in a loss of \`${Math.abs(gameSetting.down)}\` points.\n`
            + `> If the person requiring the question doesn't respond,  their score will be reduced by \`${Math.abs(gameSetting.down)}\` points.\n`
            + `\n`
            + `> Players can view their score by using \`${config.prefix}score\` command.\n`
            + `> They can also view another player score by using \`${config.prefix}score <user_ID>\`.\n`
            + `> An exclusive role will be granted to users who reach \`50\` points.`
        )
    }
    else {
        msg.react('⚠️');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.warning, 16),
                description: `:warning: ${lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;