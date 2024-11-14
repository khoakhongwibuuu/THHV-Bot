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
        .setName('mc-stop')
        .setDescription('[Moderators Only] - Force stop an instance.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!mcLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (interaction.channel.id !== mcLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${mcLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (!mcLib.isRunning(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Không có lượt chơi nào đang diễn ra.`, ephemeral: true });
            return;
        }
        mcLib.guildUnlock(interaction.guild.id);
        interaction.reply({
            content: `<@${interaction.user.id}>: đã buộc dừng lượt chơi.`,
            ephemeral: false
        });
    },
};
