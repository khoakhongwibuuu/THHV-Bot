// Packages
const Discord = require('discord.js');
const { wordLib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-export')
        .setDescription('[Debug Only] - Export this server Word Match game data. Used for debugging.')
        .setDMPermission(false)
    ,
    deprecated: true,
    async execute(interaction) {
        if (process.env.OWNER_ID !== interaction.user.id) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        const dat = wordLib.loadRawGuildFile(interaction.guild.id);
        console.log("word-match", interaction.guild.id, dat);
        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`Server data has been exported.`)
            ],
            ephemeral: true
        });
    },
};
