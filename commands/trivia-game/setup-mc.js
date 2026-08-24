// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-setup')
        .setDescription('[Moderators Only] - Create a server profile and set Trivia Game room at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
            await interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (await gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ Phòng chơi đã được đặt trước đó tại <#${await gameLib.getRoomId(interaction.guild.id)}>\n`
                    + `Vui lòng sử dụng \`/mc-changeroom\` tại phòng chơi mới nếu bạn muốn đổi phòng.`,
                ephemeral: true
            });
            return;
        }
        await gameLib.guildSetup(interaction.guild.id, interaction.channel.id);
        await interaction.reply({
            content: `Đã chọn phòng chơi: <#${interaction.channel.id}>.`,
            ephemeral: false
        });
    },
};
