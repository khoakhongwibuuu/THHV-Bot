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
        .setName('wm-score')
        .setDescription('View your WordMatch game score or anyone else.')
        .addUserOption(option =>
            option.setName("member")
                .setDescription("Member whose score you want to view")
                .setRequired(false)
        )
    ,
    async execute(interaction) {
        if (!wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "🔍 Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        const targetUser = interaction.options.getUser('member') ?? interaction.user;
        interaction.reply({
            embeds: [new Discord.EmbedBuilder().setDescription(`<@${targetUser.id}>: ${wordLib.getUserScore(interaction.guild.id, targetUser.id)}`)],
            ephemeral: !wordLib.isInRoom(interaction.guild.id, interaction.channel.id)
        });
    },
};
