// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const reactLib = require(path.join(dirname, 'modules/auto-reactor/lib/reactLib.js'));

const isValidToken = (token) => {
    const customEmojiPattern = /^<:[^\s]+:\d+>$/;
    const builtinEmojiPattern = /^(\p{Emoji})$/u;
    return (customEmojiPattern.test(token) || builtinEmojiPattern.test(token));
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('vote-set')
        .setDescription('[Moderators Only] - Set voting channel at this channel.')
        .addStringOption(option =>
            option.setName("upvote-token")
                .setDescription("The token of upvoting emoji if you want to use custom emoji.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName("downvote-token")
                .setDescription("The token of downvoting emoji if you want to use custom emoji.")
                .setRequired(false)
        )
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }

        const upvoteToken = interaction.options.getString('upvote-token') ?? "✅";
        const downvoteToken = interaction.options.getString('downvote-token') ?? "❌";

        if (!isValidToken(upvoteToken) || !isValidToken(downvoteToken)) {
            interaction.reply({
                content: "⚠️ Found at least 1 invalid token. Please try again.",
                ephemeral: true
            });
            return;
        }

        reactLib.guildSetup(interaction.guild.id, interaction.channel.id, upvoteToken, downvoteToken);
        interaction.reply({
            content: `Voting channel has been set at <#${interaction.channel.id}>.`
                + `\nI will use ${upvoteToken} for upvoting and ${downvoteToken} for downvoting.`,
            ephemeral: true
        });
    },
};
