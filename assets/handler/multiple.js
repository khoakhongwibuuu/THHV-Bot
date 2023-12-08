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
    let Content = () => {
        let ret = ""
        validKey.forEach((OptionalKey, idx) => {
            ret += (`**${OptionalKey}**. `
                + `${OptionalKey === correctKey ? (questionBlock.correct_answer).URLdecode() : (incorrectAnswer[incorrectIdx++]).URLdecode()}`
                + `${idx == 3 ? "" : "\n"}`);
        });
        return ret;
    }
    require('./deliver.js')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, Content(), "multiple", ETA);
}

module.exports.execute = execute;