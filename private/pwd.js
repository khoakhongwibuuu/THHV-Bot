// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const generate = (len) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const number = "0123456789";
    const other = "!#$%&()+,-.:;<=>?@[]^{}";
    let str = "";
    while (str.length < len) {
        let pnt = Utils.clockBasedRandom(0, 15);
        if (pnt % 4 === 1)
            str += other.charAt(Utils.clockBasedRandom(0, other.length - 1));
        else if (pnt % 4 === 2)
            str += upper.charAt(Utils.clockBasedRandom(0, upper.length - 1));
        else if (pnt % 4 === 3)
            str += number.charAt(Utils.clockBasedRandom(0, number.length - 1));
        else
            str += lower.charAt(Utils.clockBasedRandom(0, lower.length - 1));
    }
    return str;
}

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    let phrase = parseInt(para[0]);
    msg.author.send({
        embed: {
            color: (para.length !== 1 || !Number.isInteger(phrase) || phrase > 48 || phrase < 1)
                ? parseInt(Base_Lang.status.error, 16)
                : parseInt(Base_Lang.status.info, 16),
            description: (para.length !== 1 || !Number.isInteger(phrase) || phrase > 48 || phrase < 1)
                ? `:warning: ${Lang.error.parameter}`
                : `||${generate(phrase)}||`
        }
    });
}

module.exports.execute = execute;