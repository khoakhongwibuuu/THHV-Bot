// Packages
const Discord = require('discord.js');
const { wordLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-reset')
        .setDescription('[Moderators Only] - Reset Word Match used words.')
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
        if (!wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "🔍 Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (!wordLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại <#${wordLib.getRoomId(interaction.guild.id)}>.`, ephemeral: true });
            return;
        }
        wordLib.guildReset(interaction.guild.id, interaction.options.getBoolean('remove-all-player-scores'));
        interaction.reply({
            content: `Dữ liệu trò chơi ${(interaction.options.getBoolean('remove-all-player-scores')) ? "và điểm của người chơi" : ""} đã được reset!\n`
                + `Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!`,
            ephemeral: false
        });
    },
};
