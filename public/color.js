// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const hexToRgb = (hex) => {
    let obj = {}
    obj.r = +("0x" + hex[1] + hex[2]);
    obj.g = +("0x" + hex[3] + hex[4]);
    obj.b = +("0x" + hex[5] + hex[6]);
    let str = JSON.stringify(obj)
    return str.slice(1, str.length - 1)
}

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    for (let i = 0; i < 1; i++) {
        let hexString = ("000000" + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
        let intString = parseInt(hexString, 16);
        msg.channel.send({
            embed: {
                color: intString,
                // description: hexString.toUpperCase(),
                fields: [
                    {
                        name: `Hexadecimal`,
                        value: `\`\`\`css\n#${hexString.toUpperCase()}\`\`\``
                    },
                    {
                        name: `RGB`,
                        value: `\`\`\`json\n${hexToRgb("#" + hexString.toUpperCase())}\`\`\``
                    }
                ]
            }
        });
    }
}

module.exports.execute = execute;