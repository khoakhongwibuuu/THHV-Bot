// Packages
const Discord = require('discord.js');
const { gameLib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-export')
        .setDescription('[Debug Only] - Export this server Trivia game data. Used for debugging.')
        .setDMPermission(false)
    ,
    deprecated: true,
    async execute(interaction) {
        if (process.env.OWNER_ID !== interaction.user.id) {
            await interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Bạn không được phép sử dụng lệnh này khi có lượt chơi đang diễn ra. Vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        const dat = gameLib.loadRawGuildFile(interaction.guild.id);
        console.log("trivia-game:", interaction.guild.id, dat);
        await interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`Server data has been exported.`)
            ],
            ephemeral: true
        });
    },
};
