// Packages
const Discord = require('discord.js');
const { gameLib, discordAPI, discordAPIv2 } = global.customLib;

const defaultBtnRow = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId('mc-accept-uninstall')
            .setLabel('Xác nhận')
            .setEmoji('⚠️')
            .setStyle(Discord.ButtonStyle.Success)
    );

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-uninstall')
        .setDescription('[Moderators Only] - Delete this server Trivia Game profile.')
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
        if (await gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Bạn không được phép sử dụng lệnh này khi có lượt chơi đang diễn ra. Vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        const sentEmbed = new Discord.EmbedBuilder();

        let content = "⚠️ **Bạn đang xóa dữ liệu Trivia Game của server này. Bạn chắc chứ?**\n";
        const affected = await gameLib.allPlayerList(interaction.guild.id);

        content += `\nNếu bạn tiếp tục, điểm của những người chơi sau đây sẽ bị xóa.\n`;
        if (affected.length > 0)
            affected.forEach(e => content += `* <@${e}>\n`);
        else
            content += "\`\`\`Hiện tại chưa ghi nhận điểm của người chơi nào.\`\`\`";

        sentEmbed.setDescription(content);
        sentEmbed.setFooter({ text: "🕑 Bạn có 10s để xác nhận hành động của bạn." });

        await interaction.reply({
            embeds: [sentEmbed],
            components: [defaultBtnRow],
            ephemeral: true
        });

        let executed = false;
        const filter = (interaction) => interaction.isButton() && interaction.customId === "mc-accept-uninstall";
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
        collector.on('collect', async () => {
            await gameLib.guildUninstall(interaction.guild.id);
            executed = true;
            await interaction.editReply({
                embeds: [sentEmbed.setFooter({ text: "✅ Đã xóa dữ liệu thành công." })],
                components: [],
                ephemeral: true
            });
        });
        collector.on('end', async () => {
            if (!executed) {
                await interaction.editReply({
                    embeds: [sentEmbed.setFooter({ text: "⛔ Đã hết giờ." })],
                    components: [],
                    ephemeral: true
                });
            }
        });
    },
};
