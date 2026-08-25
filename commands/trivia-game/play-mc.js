// Packages
const Discord = require('discord.js');
const { dirname } = require('#assets/library/state.js');
const gameLib = require('#modules/trivia-game/lib/gameLib.js');
const stdlib = require('#assets/library/standard.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-play')
        .setDescription('Start a Trivia Game instance.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!await gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: '⚠️ Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true });
            return;
        }
        if (!await gameLib.isInRoom(interaction.guild.id, interaction.channel.id)) {
            await interaction.reply({ content: `Vui lòng sử dụng lệnh tại phòng chơi <#${await gameLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        if (await gameLib.isRunning(interaction.guild.id)) {
            await interaction.reply({ content: 'Có một lượt chơi đang diễn ra, vui lòng chờ lượt chơi đó hoàn tất.', ephemeral: true });
            return;
        }
        await gameLib.guildLock(interaction.guild.id);
        const hardModeRate = stdlib.randomPercent(90);
        const questionBlock = (hardModeRate) ? gameLib.easyReader() : gameLib.hardReader();
        await require(`#modules/trivia-game/handler/${questionBlock.type}.js`).execute(interaction, questionBlock);
    },
};
