const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));

const execute = (interaction, questionBlock) => {
    const guildTime = mcLib.loadGuildFile(interaction.guildId).setting.time;
    const ETA = guildTime.base + guildTime[questionBlock.difficulty];
    const correctKey = (questionBlock.correct_answer).URLdecode();

    require('./deliver')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            "The following statement is True or False?",
            correctKey, `> ${questionBlock.question.URLdecode()}`, "boolean", ETA);
}

module.exports = {
    execute
}