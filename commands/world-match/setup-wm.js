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
        .setDescription('[Moderators Only] - Set WordMatch game at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (interaction.channel.type === Discord.ChannelType.DM || interaction.channel.type === Discord.ChannelType.GroupDM) {
            interaction.reply({
                content: "⚠️ This command cannot be used in Direct Messages.",
                ephemeral: true
            });
            return;
        }
        
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        const status = wordLib.isSetup(interaction.guild.id);
        wordLib.guildSetup(interaction.guild.id, interaction.channel.id);
        interaction.reply({
            content: `Đã ${status ? "thay đổi sang" : "chọn"} phòng chơi: <#${interaction.channel.id}>.\n`
                + `Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!`,
            ephemeral: false
        });
    },
};
