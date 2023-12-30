const dirname = global.dirname;
const stdlib = global.stdlib;

const execute = (interaction, questionBlock) => {
    const gameLib = require(dirname + '/assets/library/game.js');

    // Variables
    const validKey = ['A', 'B', 'C', 'D'];
    const ETA = gameLib.loadSetting().time + gameLib.loadSetting().mode[questionBlock.difficulty];

    // Generate Answer Key
    let correctKeyIdx = stdlib.clockBasedRandom(0, 3);
    const correctKey = validKey[correctKeyIdx];

    // Load incorrect answers
    let incorrectAnswer = questionBlock.incorrect_answers;
    let incorrectIdx = 0;
    stdlib.shuffle(incorrectAnswer);

    // Generate content
    let content = "";
    validKey.forEach((OptionalKey, idx) => {
        const answer = OptionalKey === correctKey ? questionBlock.correct_answer : incorrectAnswer[incorrectIdx++];
        content += `**${OptionalKey}**. ${answer.URLdecode()}${idx == 3 ? "" : "\n"}`;
    });

    require('./deliver.js')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, content, "multiple", ETA);
}

module.exports.execute = execute;