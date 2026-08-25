// Packages
const gameLib = require('#modules/trivia-game/lib/gameLib.js');

module.exports.execute = async (interaction, questionBlock) => {
    const time = gameLib.getTimeAllowed(questionBlock.difficulty);
    const correctKey = (questionBlock.correct_answer).URLdecode();

    await require('./deliver')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            "The following statement is True or False?",
            correctKey, `> ${questionBlock.question.URLdecode()}`, "boolean", time);
}
