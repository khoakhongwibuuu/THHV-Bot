// Packages
const Discord = require('discord.js');
const wordLib = require('#modules/word-match/lib/wordLib.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-reset')
        .setDescription('[Moderators Only] - Reset WordMatch used words.')
        .addBooleanOption(option =>
            option.setName("remove-all-player-scores")
                .setDescription("Delete all player scores?")
                .setRequired(true)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!await wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "🔍 Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (!await wordLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại <#${await wordLib.getRoomId(interaction.guild.id)}>.`, ephemeral: true });
            return;
        }
        await wordLib.guildReset(interaction.guild.id, interaction.options.getBoolean('remove-all-player-scores'));
        interaction.reply({
            content: `Dữ liệu trò chơi ${(interaction.options.getBoolean('remove-all-player-scores')) ? "và điểm của tất cả người chơi " : ""}đã được reset!\n`
                + `Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!`,
            ephemeral: false
        });
    },
};
