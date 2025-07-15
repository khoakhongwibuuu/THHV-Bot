// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-stop')
        .setDescription('[Moderators Only] - Force stop the running Trivia game an instance in this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!gameLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (interaction.channel.id !== gameLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${gameLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (!gameLib.isRunning(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Không có lượt chơi nào đang diễn ra.`, ephemeral: true });
            return;
        }
        gameLib.guildUnlock(interaction.guild.id);
        interaction.reply({
            content: `<@${interaction.user.id}>: đã buộc dừng lượt chơi.`,
            ephemeral: false
        });
    },
};
