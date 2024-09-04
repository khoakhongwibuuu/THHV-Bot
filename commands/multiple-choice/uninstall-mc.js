// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));

const defaultBtnRow = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId('True')
            .setLabel('Xác nhận')
            .setEmoji('⚠️')
            .setStyle('Success')
    );

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-uninstall')
        .setDescription('[Moderators Only] - Delete this server MultipleChoice game profile.')
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!mcLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (interaction.channel.id !== mcLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${mcLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        const sentEmbed = new Discord.EmbedBuilder();

        let content = "⚠️ **Bạn đang xóa dữ liệu Trivia game của server này. Bạn chắc chứ?**\n";
        const affected = mcLib.allPlayerList(interaction.guild.id);

        content += `\nNếu bạn tiếp tục, điểm và phép bổ trợ của những người chơi sau đây sẽ bị xóa.\n`;
        if (affected.length > 0)
            affected.forEach(e => content += `* <@${e}>\n`);
        else
            content += "\`\`\`Hiện tại chưa ghi nhận điểm của người chơi nào.\`\`\`";

        sentEmbed.setDescription(content);
        sentEmbed.setFooter({ text: "🕑 Bạn có 10s để xác nhận hành động của bạn." });

        interaction.reply({
            embeds: [sentEmbed],
            components: [defaultBtnRow],
            ephemeral: true
        });

        let executed = false;
        const filter = (interaction) => interaction.isButton();
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
        collector.on('collect', async () => {
            await mcLib.guildUninstall(interaction.guild.id);
            executed = true;
            interaction.editReply({
                embeds: [sentEmbed.setFooter({ text: "✅ Đã xóa dữ liệu thành công." })],
                components: [],
                ephemeral: true
            });
        });
        collector.on('end', () => {
            if (!executed) {
                interaction.editReply({
                    embeds: [sentEmbed.setFooter({ text: "⛔ Đã hết giờ." })],
                    components: [],
                    ephemeral: true
                });
            }
        });
    },
};
