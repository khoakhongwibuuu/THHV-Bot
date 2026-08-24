// Packages
const Discord = require('discord.js');
const path = require('node:path');
const { dirname } = global.variable;
const { gameLib, stdlib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-play')
        .setDescription('Start a Trivia Game instance.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true });
            return;
        }
        if (!gameLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            await interaction.reply({ content: `Vui lòng sử dụng lệnh tại phòng chơi <#${gameLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: 'Có một lượt chơi đang diễn ra, vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        gameLib.guildLock(interaction.guild.id);
        const hardModeRate = stdlib.randomPercent(90);
        const questionBlock = (hardModeRate) ? gameLib.easyReader() : gameLib.hardReader();
        await require(path.join(dirname, "modules/trivia-game/handler", questionBlock.type)).execute(interaction, questionBlock);
    },
};
