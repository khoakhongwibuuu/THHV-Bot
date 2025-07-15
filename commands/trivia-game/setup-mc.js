// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-setup')
        .setDescription('[Moderators Only] - Create a server profile and set Trivia game room at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (gameLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: `⚠️ Phòng chơi đã được đặt trước đó tại <#${gameLib.getRoomId(interaction.guild.id)}>\n`
                    + `Vui lòng sử dụng \`/mc-changeroom\` tại phòng chơi mới nếu bạn muốn đổi phòng.`,
                ephemeral: true
            });
            return;
        }
        gameLib.guildSetup(interaction.guild.id, interaction.channel.id);
        interaction.reply({
            content: `Đã chọn phòng chơi: <#${interaction.channel.id}>.`,
            ephemeral: false
        });
    },
};
