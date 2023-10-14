// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const genRanHex = (num) => {
    let res = "";
    let val = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < num; i++)
        res += val[Utils.clockBasedRandom(0, val.length - 1)];
    return res;
}

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    for (let i = 0; i < 1; i++) {
        let hexString = genRanHex(6);
        let intString = parseInt(hexString, 16);
        msg.channel.send({
            embed: {
                color: intString,
                description: hexString.toUpperCase(),
            }
        });
    }
}

module.exports.execute = execute;