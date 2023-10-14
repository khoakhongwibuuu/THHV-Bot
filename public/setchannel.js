// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Special
const Persist = global.Persist;
const savePersist = global.savePersist

const execute = (msg, para) => {
    if (msg.channel.type === 'text') {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (!msg.member.hasPermission('MANAGE_CHANNELS')) {
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.error, 16),
                    description: `:no_entry: ${Lang.denied.moderator}`,
                }
            });
        } else {
            Persist.channel[msg.guild.id] = msg.channel.id;
            Persist.ready[msg.guild.id] = true;
            savePersist();
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.success, 16),
                    description: `${Lang.commands.setchannel.exec}`,
                }
            });
        }
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.error, 16),
                description: `${Lang.commands.setchannel.err}`,
            }
        });
    }
}

module.exports.execute = execute;