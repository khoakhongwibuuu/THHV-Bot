// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg) => {
    if (msg.channel.type === 'text') {
        if (!msg.channel.permissionsFor(client.user).has('ADD_REACTIONS')) return;
        let ac = "700345520081600512"
        let wa = "700345520039657613"
        msg.react(ac);
        msg.react(wa);
    }
}

module.exports.execute = execute;