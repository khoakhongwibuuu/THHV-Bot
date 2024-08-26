// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const wordLib = require(path.join(dirname, 'modules/word-match/lib/wordLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('reset-wordmatch')
        .setDescription('[Moderators Only] - Reset wordMatch game.')
        .addBooleanOption(option =>
            option.setName("remove-all-player-scores")
                .setDescription("Delete all player scores?")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            wordLib.guildReset(interaction.guild.id, interaction.options.getBoolean('remove-all-player-scores'));
            interaction.reply({
                content: `Dữ liệu trò chơi ${(interaction.options.getBoolean('remove-all-player-scores')) ? "và điểm của người chơi" : ""} đã được reset!\n`
                    + `Đã chọn phòng chơi: <#${interaction.channel.id}>.\n`
                    + `Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!`,
                ephemeral: false
            });
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
