const dirname = global.dirname;
const stdlib = global.stdlib;

const execute = (interaction, questionBlock) => {
    const gameLib = require(dirname + '/assets/library/game.js');

    const ETA = gameLib.loadSetting().time + gameLib.loadSetting().mode[questionBlock.difficulty];
    const correctKey = (questionBlock.correct_answer).URLdecode();
    let Content = () => "True or False ? \n**A**. True \n**B**. False"
    require('./deliver.js')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, Content(), "boolean", ETA);
}

module.exports.execute = execute;