const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const dirname = global.dirname;

// Load game configuration
const gamesetting = JSON.parse(fs.readFileSync(dirname + '/game/setting/game.json', 'utf8'));

// driver module
const execute = (msg, para) => {
    if (para.length === 1) {
        msg.channel.send(`**How to play ?**`
            + `\n`
            + `> Players will take turns using \`${Config.prefix}get\` command to receive a random question.\n`
            + `\n`
            + `> There will be \`2\` types of questions: \`Multiple choice\` and \`True or False\`\n`
            + `> The time limit for responding to a question is \`${gamesetting.ETA}\` seconds.\n`
            + `\n`
            + `> Only \`ONE\` response per player is permitted.\n`
            + `> Think carefully before responding because a correct response will bring \`${Math.abs(gamesetting.up)}\` points, but an incorrect response will result in a loss of \`${Math.abs(gamesetting.down)}\` points.\n`
            + `\n`
            + `> If the person requiring the question doesn't respond,  their score will be reduced by \`${Math.abs(gamesetting.down)}\` points.\n`
            + `\n`
            + `> Players can view their score by using \`${Config.prefix}get score\` command.\n`
            + `> They can also view another player score by using \`${Config.prefix}get score <user_ID>\`.`,
        )
    } else {
        // Invalid parameter to handle
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.warning, 16),
                description: `:warning: ${Lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;