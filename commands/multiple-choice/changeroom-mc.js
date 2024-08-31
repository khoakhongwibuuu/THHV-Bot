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
        .setName('mc-changeroom')
        .setDescription('[Moderators Only] - Change MultipleChoice game room at this channel.')
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            if (!mcLib.isSetup(interaction.guild.id)) {
                interaction.reply({
                    content: `⚠️ Không tìm thấy phòng chơi trên server này.\n`
                        + `Vui lòng sử dụng \`/mc-setup\` để đặt phòng chơi.`,
                    ephemeral: true
                });
            } else {
                mcLib.resetRoomId(interaction.guild.id, interaction.channel.id);
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
