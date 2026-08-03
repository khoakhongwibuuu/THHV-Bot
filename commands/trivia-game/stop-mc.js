// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-stop')
        .setDescription('[Moderators Only] - Force stop the running Trivia game an instance in this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
            await interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (!gameLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            await interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${gameLib.getRoom(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (!gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: `⚠️ Không có lượt chơi nào đang diễn ra.`, ephemeral: true });
            return;
        }
        gameLib.guildUnlock(interaction.guild.id);
        await interaction.reply({
            content: `Moderator <@${interaction.user.id}> đã buộc dừng chơi này.\nKết quả của lượt chơi sẽ không được ghi nhận.`,
            ephemeral: false
        });
    },
};
