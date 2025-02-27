// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const mcLib = require(path.join(global.dirname, 'modules/multiple-choice/lib/gameLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-export')
        .setDescription('[Moderators Only] - Export this server game data.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!global.discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
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
        if (mcLib.isRunning(interaction.guild.id)) {
            interaction.reply({ content: '⚠️ Bạn không được phép sử dụng lệnh này khi có lượt chơi đang diễn ra. Vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        const dat = mcLib.loadRawGuildFile(interaction.guild.id);
        const sentText = null;
        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`Server encrypted data. Required by <@${interaction.user.id}>\n\`\`\`${dat}\`\`\``)
            ],
            ephemeral: true
        });
    },
};
