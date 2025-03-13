const path = require('path');
const Discord = require('discord.js');

// Module Specified
const mcLib = require(path.join(global.dirname, 'modules/multiple-choice/lib/gameLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-play')
        .setDescription('Start a MultipleChoice game instance.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!mcLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: '⚠️ Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true });
            return;
        }
        if (interaction.channel.id !== mcLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `Vui lòng sử dụng lệnh tại phòng chơi <#${mcLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (mcLib.isRunning(interaction.guild.id)) {
            interaction.reply({ content: 'Có một lượt chơi đang diễn ra, vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        mcLib.guildLock(interaction.guild.id);
        let booleanRate = global.stdlib.randomPercent(50);
        const questionBlock = (booleanRate) ? mcLib.booleanReader() : mcLib.multipleReader();
        require(path.join(global.dirname, "modules/multiple-choice/handler", questionBlock.type)).execute(interaction, questionBlock);
    },
};
