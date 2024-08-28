// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const wordLib = require(path.join(dirname, 'modules/word-match/lib/wordLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-setup')
        .setDescription('[Moderators Only] - Set wWrdMatch game at this channel.')
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            wordLib.guildSetup(interaction.guild.id, interaction.channel.id);
            interaction.reply({
                content: `Đã chọn phòng chơi: <#${interaction.channel.id}>.\n`
                    + `Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!`,
                ephemeral: false
            });
        } else {
            interaction.reply({
                content: "🚫 Bạn không có quyền sử dụng lệnh này.",
                ephemeral: true
            });
        }
    },
};
