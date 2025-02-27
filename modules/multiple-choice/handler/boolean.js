const path = require('path');
const Discord = require('discord.js');

// Module Specified
const mcLib = require(path.join(global.dirname, 'modules/multiple-choice/lib/gameLib.js'));

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