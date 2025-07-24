// Packages
const Discord = require('discord.js');
const path = require('node:path');
const { dirname } = global.variable;
const { gameLib, stdlib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-play')
        .setDescription('Start a Trivia game instance.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true });
            return;
        }
        if (!gameLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            await interaction.reply({ content: `Vui lòng sử dụng lệnh tại phòng chơi <#${gameLib.getRoom(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: 'Có một lượt chơi đang diễn ra, vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        gameLib.guildLock(interaction.guild.id);
        let booleanRate = stdlib.randomPercent(50);
        const questionBlock = (booleanRate) ? gameLib.booleanReader() : gameLib.multipleReader();
        await require(path.join(dirname, "modules/trivia-game/handler", questionBlock.type)).execute(interaction, questionBlock);
    },
};
