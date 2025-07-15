// Packages
const { gameLib } = global.customLib;

const execute = (interaction, questionBlock) => {
    const guildTime = gameLib.loadGuildFile(interaction.guildId).setting.time;
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