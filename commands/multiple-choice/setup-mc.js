// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-setup')
        .setDescription('[Moderators Only] - Set MultipleChoice game room at this channel.')
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            if (mcLib.isSetup(interaction.guild.id)) {
                interaction.reply({
                    content: `⚠️ Phòng chơi đã được đặt trước đó tại <#${mcLib.getRoomId(interaction.guild.id)}>\n`
                        + `Vui lòng sử dụng \`/mc-changeroom\` tại phòng chơi mới nếu bạn muốn đổi phòng.`,
                    ephemeral: true
                });
            } else {
                mcLib.guildSetup(interaction.guild.id, interaction.channel.id);
                interaction.reply({
                    content: `Đã chọn phòng chơi: <#${interaction.channel.id}>.`,
                    ephemeral: false
                });
            }
        } else {
            interaction.reply({
                content: "🚫 Bạn không có quyền sử dụng lệnh này.",
                ephemeral: true
            });
        }
    },
};
