// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const mcLib = require(path.join(global.dirname, 'modules/multiple-choice/lib/gameLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-export')
        .setDescription('[Debug Only] - Export this server trivia-game data. Used for debugging.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID !== interaction.user.id) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!mcLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (mcLib.isRunning(interaction.guild.id)) {
            interaction.reply({ content: '⚠️ Bạn không được phép sử dụng lệnh này khi có lượt chơi đang diễn ra. Vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        const dat = mcLib.loadRawGuildFile(interaction.guild.id);
        console.log("trivia-game:", interaction.guild.id, dat);
        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`Server data has been exported.`)
            ],
            ephemeral: true
        });
    },
};
