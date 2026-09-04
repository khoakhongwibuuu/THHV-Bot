// Packages
const Discord = require('discord.js');
const gameLib = require('#modules/trivia-game/lib/gameLib.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-stop')
        .setDescription('[Moderators Only] - Force stop the running Trivia Game an instance in this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
            await interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!await gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (!await gameLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            await interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${await gameLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (!await gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: `⚠️ Không có lượt chơi nào đang diễn ra.`, ephemeral: true });
            return;
        }
        await gameLib.guildUnlock(interaction.guild.id);
        await interaction.reply({
            content: `Moderator <@${interaction.user.id}> đã buộc dừng chơi này.\nKết quả của lượt chơi sẽ không được ghi nhận.`,
            ephemeral: false
        });
    },
};
