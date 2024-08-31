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

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-stop')
        .setDescription('[Moderators Only] - Force stop an instance.')
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            if (!mcLib.isSetup(interaction.guild.id)) {
                interaction.reply({ content: 'Phòng chơi chưa được cài đặt trên server này. Vui lòng sử dụng `/mc-setup` để đặt phòng chơi.', ephemeral: true })
            } else {
                if (!mcLib.isRunning(interaction.guild.id)) {
                    interaction.reply({
                        content: `Không có lượt chơi nào đang diễn ra.`,
                        ephemeral: true
                    });
                } else {
                    mcLib.guildUnlock(interaction.guild.id);
                    interaction.reply({
                        content: `<@${interaction.user.id}>: đã buộc dừng lượt chơi.`,
                        ephemeral: false
                    });
                }
            }
        } else {
            interaction.reply({
                content: "🚫 Bạn không có quyền sử dụng lệnh này.",
                ephemeral: true
            });
        }
    },
};
