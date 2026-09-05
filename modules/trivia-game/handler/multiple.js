// Packages
const gameLib = require('#modules/trivia-game/lib/gameLib.js');
const stdlib = require('#assets/library/standard.js');

module.exports.execute = async (interaction, questionBlock) => {
    const validKey = ['A', 'B', 'C', 'D'];
    const time = gameLib.getTimeAllowed(questionBlock.difficulty);

    const correctKeyIdx = stdlib.trueRnd(0, 3);
    const correctKey = validKey[correctKeyIdx];

    let incorrectAnswer = questionBlock.incorrect_answers;
    let incorrectIdx = 0;
    stdlib.shuffle(incorrectAnswer);

    let content = "";
    validKey.forEach((OptionalKey, idx) => {
        const answer = (OptionalKey) === correctKey ? questionBlock.correct_answer : incorrectAnswer[incorrectIdx++];
        content += `**${OptionalKey}**. ${answer.URLdecode()}${idx == 3 ? "" : "\n"}`;
    });

    await require('./deliver')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, content, "multiple", time);
}
