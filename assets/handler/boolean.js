const dirname = global.dirname;
const stdlib = global.stdlib;

const execute = (interaction, questionBlock) => {
    const gameLib = require(dirname + '/assets/library/game.js');
    const serverLib = require(dirname + '/assets/library/server.js');
    const ETA = gameLib.loadSetting().time + gameLib.loadSetting().mode[questionBlock.difficulty];
    const correctKey = (questionBlock.correct_answer).URLdecode();
    require('./deliver.js')
        .execute(interaction,
            questionBlock.category.URLdecode(),
            questionBlock.difficulty.URLdecode(),
            questionBlock.question.URLdecode(),
            correctKey, `True or False ?`, "boolean", ETA);
}

module.exports.execute = execute;