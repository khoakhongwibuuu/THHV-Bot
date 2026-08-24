// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-changeroom')
        .setDescription('[Moderators Only] - Change Trivia Game room at this channel.')
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
            await interaction.reply({ content: '⚠️ Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true });
            return;
        }
        if (gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Bạn không được phép sử dụng lệnh này khi có lượt chơi đang diễn ra. Vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        gameLib.resetRoomId(interaction.guild.id, interaction.channel.id);
        await interaction.reply({
            content: `Đã thay đổi sang phòng chơi: <#${interaction.channel.id}>.`,
            ephemeral: false
        });
    },
};
