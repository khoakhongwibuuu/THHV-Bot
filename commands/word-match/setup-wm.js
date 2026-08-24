// Packages
const Discord = require('discord.js');
const { wordLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-setup')
        .setDescription('[Moderators Only] - Create a server profile and set WordMatch game room at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
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
