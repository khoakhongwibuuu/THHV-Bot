// Packages
const Discord = require('discord.js');
const { wordLib, discordAPI } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-setup')
        .setDescription('[Moderators Only] - Create a server profile and set Word Match game room at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
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
